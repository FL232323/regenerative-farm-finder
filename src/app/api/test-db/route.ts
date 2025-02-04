import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Farm from '@/models/Farm';

export async function GET(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Test database connection by counting farms
    const farmCount = await Farm.countDocuments();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      farmCount: farmCount
    }, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
