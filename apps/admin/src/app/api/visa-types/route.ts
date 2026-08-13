import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { VisaType } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const visaTypes = await VisaType.find().populate('countryId').sort({ order: 1 });
  return NextResponse.json(visaTypes);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const visaType = await VisaType.create(data);
  return NextResponse.json(visaType, { status: 201 });
}
