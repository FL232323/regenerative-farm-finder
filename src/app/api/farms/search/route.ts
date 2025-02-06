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
      throw new Error('Geocoding service error');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zipCode');
    const radius = Number(searchParams.get('radius')) || 50;
    const type = searchParams.get('type');

    if (!zipCode) {
      return NextResponse.json(
        { error: 'Zip code is required' },
        { status: 400 }
      );
    }

    const location = await geocodeZipCode(zipCode);
    if (!location) {
      return NextResponse.json(
        { error: 'Invalid zip code or geocoding service error' },
        { status: 400 }
      );
    }

    const radiusInMeters = radius * 1609.34;

    const pipeline = [
      {
        $search: {
          "index": "Farmsearch",
          "compound": {
            "must": [{
              "geoWithin": {
                "path": "location",
                "circle": {
                  "center": {
                    "type": "Point",
                    "coordinates": [location.lon, location.lat]
                  },
                  "radius": radiusInMeters
                }
              }
            }]
          }
        }
      },
      {
        $addFields: {
          distance: {
            $round: [{
              $multiply: [
                {
                  $divide: [
                    {
                      $sqrt: {
                        $add: [
                          {
                            $pow: [
                              {
                                $multiply: [
                                  69.1,
                                  { $subtract: [{ $arrayElemAt: ["$location.coordinates", 1] }, location.lat] }
                                ]
                              },
                              2
                            ]
                          },
                          {
                            $pow: [
                              {
                                $multiply: [
                                  69.1,
                                  { $cos: { $degreesToRadians: location.lat } },
                                  { $subtract: [{ $arrayElemAt: ["$location.coordinates", 0] }, location.lon] }
                                ]
                              },
                              2
                            ]
                          }
                        ]
                      }
                    },
                    1
                  ]
                },
                1
              ]
            }, 1]
          }
        }
      },
      {
        $match: {
          $or: [
            { "deliveryOptions.localPickup": true },
            {
              $and: [
                { "deliveryOptions.delivery": true },
                {
                  $expr: {
                    $lte: ["$distance", "$deliveryOptions.deliveryRange"]
                  }
                }
              ]
            }
          ]
        }
      }
    ];

    if (type) {
      pipeline.push({
        $match: {
          businessType: type
        }
      });
    }

    const farms = await Farm.aggregate(pipeline);
    return NextResponse.json(farms, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error processing search' },
      { status: 500 }
    );
  }
}