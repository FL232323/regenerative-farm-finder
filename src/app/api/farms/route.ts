import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Farm from '@/models/Farm';

export async function GET(request: NextRequest) {
  await connectDB();
  const farms = await Farm.find({});
  return NextResponse.json(farms, { status: 200 });
}

export async function POST(request: NextRequest) {
  await connectDB();
  const data = await request.json();
  const newFarm = new Farm(data);
  await newFarm.save();
  return NextResponse.json(newFarm, { status: 201 });
}

export async function PUT(request: NextRequest) {
  await connectDB();
  const { id, ...data } = await request.json();
  const updatedFarm = await Farm.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updatedFarm, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  await connectDB();
  const { id } = await request.json();
  await Farm.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Farm deleted' }, { status: 204 });
}
