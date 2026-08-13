import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SiteSettings } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const settings = await SiteSettings.findOne();
  return NextResponse.json(settings || {});
}

export async function PUT(request: Request) {
  await connectDB();
  const data = await request.json();
  const settings = await SiteSettings.findOneAndUpdate({}, data, { upsert: true, new: true });
  return NextResponse.json(settings);
}
