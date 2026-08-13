import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const service = await Service.create(data);
  return NextResponse.json(service, { status: 201 });
}
