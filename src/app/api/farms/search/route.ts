import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Farm from '@/models/Farm';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zipCode');
    const radius = Number(searchParams.get('radius')) || 50; // Default 50 miles
    const type = searchParams.get('type');
    
    // If no zip code provided, return error
    if (!zipCode) {
      return NextResponse.json(
        { error: 'Zip code is required' },
        { status: 400 }
      );
    }

    // First, fetch coordinates for zip code
    const geocodeUrl = `https://api.opencagedata.com/geocode/v1/json?q=${zipCode}&countrycode=us&limit=1&key=${process.env.OPENCAGE_API_KEY}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();

    if (!geocodeData.results?.[0]?.geometry) {
      return NextResponse.json(
        { error: 'Invalid zip code' },
        { status: 400 }
      );
    }

    const { lat, lng } = geocodeData.results[0].geometry;

    // Build query
    let query: any = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
          },
          $maxDistance: radius * 1609.34 // Convert miles to meters
        }
      }
    };

    // Add business type filter if provided
    if (type) {
      query.businessType = type;
    }

    // Fetch farms within radius
    const farms = await Farm.find(query)
      .limit(50) // Limit results
      .select('name businessType location address description products images'); // Select relevant fields

    // Calculate distance for each farm
    const farmsWithDistance = farms.map(farm => {
      const farmData = farm.toObject();
      const [farmLng, farmLat] = farm.location.coordinates;
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(lat, lng, farmLat, farmLng);
      
      return {
        ...farmData,
        distance: Math.round(distance * 10) / 10 // Round to 1 decimal place
      };
    });

    return NextResponse.json(farmsWithDistance, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error processing search' },
      { status: 500 }
    );
  }
}

// Haversine formula for calculating distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Radius of Earth in miles
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
