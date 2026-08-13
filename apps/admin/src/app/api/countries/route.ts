import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Country } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const countries = await Country.find().sort({ order: 1 });
  return NextResponse.json(countries);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const country = await Country.create(data);
  return NextResponse.json(country, { status: 201 });
}
