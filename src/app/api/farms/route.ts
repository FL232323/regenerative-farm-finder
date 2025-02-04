import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Farm, { IFarm } from '@/models/Farm';

export async function GET(request: NextRequest) {
  await connectMongoDB();
  
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = parseFloat(searchParams.get('radius') || '100'); // kilometers
  const practices = searchParams.get('practices')?.split(',');
  const products = searchParams.get('products')?.split(',');

  try {
    let query: any = {};

    // Geospatial query if coordinates are provided
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert to meters
        }
      };
    }

    // Filter by practices if specified
    if (practices && practices.length > 0) {
      query.practices = { $in: practices };
    }

    // Filter by products if specified
    if (products && products.length > 0) {
      query.products = { $in: products };
    }

    const farms: IFarm[] = await Farm.find(query).limit(50);

    return NextResponse.json({
      success: true,
      count: farms.length,
      data: farms
    }, { status: 200 });
  } catch (error) {
    console.error('Farm retrieval error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving farms'
    }, { status: 500 });
  }
}

// Optional: Add POST method for farm creation (with authentication in future)
export async function POST(request: NextRequest) {
  await connectMongoDB();

  try {
    const farmData = await request.json();
    
    // Add validation logic here
    const newFarm = new Farm(farmData);
    await newFarm.save();

    return NextResponse.json({
      success: true,
      data: newFarm
    }, { status: 201 });
  } catch (error) {
    console.error('Farm creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating farm'
    }, { status: 400 });
  }
}
