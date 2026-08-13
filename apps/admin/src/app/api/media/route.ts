import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const media = await Media.find().sort({ createdAt: -1 });
  return NextResponse.json(media);
}
