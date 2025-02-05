import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Farm from '@/models/Farm';

const NOMINATIM_DELAY = 1000;
let lastRequestTime = 0;

async function geocodeZipCode(zipCode: string): Promise<{ lat: number; lon: number } | null> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < NOMINATIM_DELAY) {
    await new Promise(resolve => setTimeout(resolve, NOMINATIM_DELAY - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  try {
    console.log('Geocoding zip code:', zipCode);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=USA&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'RegenerativeFarmFinder/1.0',
          'Accept-Language': 'en'
        }
      }
    );

    if (!response.ok) {
      console.error('Geocoding response not ok:', response.status);
      throw new Error('Geocoding service error');
    }

    const data = await response.json();
    console.log('Geocoding response:', data);
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
      console.log('Parsed coordinates:', result);
      return result;
    }
    console.log('No geocoding results found');
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('Starting search request');
    await connectDB();
    console.log('MongoDB connected');
    
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zipCode');
    const radius = Number(searchParams.get('radius')) || 50;
    const type = searchParams.get('type');
    
    console.log('Search parameters:', { zipCode, radius, type });

    if (!zipCode) {
      console.log('No zip code provided');
      return NextResponse.json(
        { error: 'Zip code is required' },
        { status: 400 }
      );
    }

    const location = await geocodeZipCode(zipCode);
    if (!location) {
      console.log('Geocoding failed');
      return NextResponse.json(
        { error: 'Invalid zip code or geocoding service error' },
        { status: 400 }
      );
    }

    // Convert miles to meters for the search radius
    const radiusInMeters = radius * 1609.34;

    // Create Atlas Search query
    const searchQuery = {
      $search: {
        index: "default", // the name we gave our search index
        compound: {
          must: [
            {
              geoWithin: {
                path: "location",
                circle: {
                  center: {
                    type: "Point",
                    coordinates: [location.lon, location.lat]
                  },
                  radius: radiusInMeters
                }
              }
            }
          ],
          ...(type && {
            filter: [{
              text: {
                query: type,
                path: "businessType"
              }
            }]
          })
        }
      }
    };

    console.log('Atlas Search query:', JSON.stringify(searchQuery, null, 2));

    // Execute the search query
    const farms = await Farm.aggregate([
      searchQuery,
      {
        $addFields: {
          distance: {
            $divide: [
              {
                $multiply: [
                  {
                    $sqrt: {
                      $add: [
                        {
                          $pow: [
                            { $multiply: [69.1, { $subtract: ["$location.coordinates.1", location.lat] }] },
                            2
                          ]
                        },
                        {
                          $pow: [
                            {
                              $multiply: [
                                69.1,
                                { $cos: { $degreesToRadians: location.lat } },
                                { $subtract: ["$location.coordinates.0", location.lon] }
                              ]
                            },
                            2
                          ]
                        }
                      ]
                    }
                  },
                  10
                ]
              },
              10
            ]
          }
        }
      }
    ]).exec();
    
    console.log('Found farms:', farms.length);

    return NextResponse.json(farms, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error processing search: ' + error.message },
      { status: 500 }
    );
  }
}