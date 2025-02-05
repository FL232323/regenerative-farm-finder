import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Farm from '@/models/Farm';

// Add rate limiting for Nominatim (1 request per second)
const NOMINATIM_DELAY = 1000; // 1 second
let lastRequestTime = 0;

async function geocodeZipCode(zipCode: string): Promise<{ lat: number; lon: number } | null> {
  // Ensure we're respecting the rate limit
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

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zipCode');
    const radius = Number(searchParams.get('radius')) || 50; // Default to 50 miles
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

    // Base query with location
    const baseQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.lon, location.lat]
          },
          $maxDistance: radius * 1609.34 // Convert miles to meters
        }
      }
    };

    // Add business type filter if provided
    if (type) {
      baseQuery['businessType'] = type;
    }

    // Split into local and shipping queries
    const localQuery = {
      ...baseQuery,
      $or: [
        { 'shippingOptions.offersShipping': { $ne: true } },
        { 'shippingOptions.offersShipping': { $exists: false } }
      ]
    };

    const shippingQuery = {
      ...baseQuery,
      'shippingOptions.offersShipping': true
    };

    // Execute both queries
    const [localResults, shippingResults] = await Promise.all([
      Farm.find(localQuery)
        .select('name businessType location address description products operatingHours scheduledTimes images')
        .limit(50),
      Farm.find(shippingQuery)
        .select('name businessType location address description products shippingOptions images')
        .limit(50)
    ]);

    // Add distance calculations
    const addDistance = (farm) => {
      const [lng, lat] = farm.location.coordinates;
      return {
        ...farm.toObject(),
        distance: Math.round(calculateDistance(location.lat, location.lon, lat, lng) * 10) / 10
      };
    };

    const localResultsWithDistance = localResults.map(addDistance)
      .sort((a, b) => a.distance - b.distance);
    
    const shippingResultsWithDistance = shippingResults.map(addDistance)
      .sort((a, b) => a.distance - b.distance);

    // Combine results maintaining existing API response format
    const combinedResults = [
      ...localResultsWithDistance,
      ...shippingResultsWithDistance.filter(farm => 
        farm.shippingOptions?.radius ? farm.distance <= farm.shippingOptions.radius : true
      )
    ];

    return NextResponse.json(combinedResults, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error processing search' },
      { status: 500 }
    );
  }
}