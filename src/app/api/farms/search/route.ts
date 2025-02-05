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

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lon, location.lat]
          },
          $maxDistance: radius * 1609.34
        }
      }
    };

    if (type) {
      query.businessType = type;
    }

    console.log('MongoDB query:', JSON.stringify(query, null, 2));

    // First, let's check if we can find any farms at all
    const totalFarms = await Farm.countDocuments();
    console.log('Total farms in database:', totalFarms);

    // Then check if our index exists
    const indexes = await Farm.collection.indexes();
    console.log('Collection indexes:', indexes);

    const farms = await Farm.find(query)
      .limit(50)
      .select('name businessType location address description products images');
    
    console.log('Found farms:', farms.length);

    const farmsWithDistance = farms.map(farm => {
      const farmData = farm.toObject();
      const [farmLng, farmLat] = farm.location.coordinates;
      const distance = calculateDistance(location.lat, location.lon, farmLat, farmLng);
      return {
        ...farmData,
        distance: Math.round(distance * 10) / 10
      };
    });

    console.log('Processed farms with distance:', farmsWithDistance.length);
    return NextResponse.json(farmsWithDistance, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error processing search: ' + error.message },
      { status: 500 }
    );
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}