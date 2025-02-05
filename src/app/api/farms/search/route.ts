import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { farms } from '@/lib/schema';
import { sql } from 'drizzle-orm';

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

export async function GET(request: NextRequest) {
  try {
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

    // Create a spatial point from the coordinates
    const point = `POINT(${location.lon} ${location.lat})`;

    // Base query using ST_Distance_Sphere for accurate distance calculation
    let baseQuery = sql`
      SELECT *,
        ST_Distance_Sphere(
          location,
          ST_GeomFromText(${point}, 4326)
        ) * 0.000621371 as distance  -- Convert meters to miles
      FROM ${farms}
      WHERE ST_Distance_Sphere(
        location,
        ST_GeomFromText(${point}, 4326)
      ) * 0.000621371 <= ${radius}
    `;

    // Add business type filter if provided
    if (type) {
      baseQuery = sql`
        ${baseQuery}
        AND JSON_CONTAINS(business_type, ${JSON.stringify(type)}, '$')
      `;
    }

    // Execute query
    const results = await db.execute(baseQuery);

    // Process results
    const farmResults = results.rows.map((row: any) => ({
      ...row,
      businessType: JSON.parse(row.business_type),
      address: JSON.parse(row.address),
      products: row.products ? JSON.parse(row.products) : [],
      operatingHours: row.operating_hours ? JSON.parse(row.operating_hours) : [],
      scheduledTimes: row.scheduled_times ? JSON.parse(row.scheduled_times) : [],
      shippingOptions: row.shipping_options ? JSON.parse(row.shipping_options) : null,
      images: row.images ? JSON.parse(row.images) : [],
      distance: Math.round(row.distance * 10) / 10
    }))
    .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(farmResults, { status: 200 });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error processing search' },
      { status: 500 }
    );
  }
}