import { NextResponse } from 'next/server';
import { connectDB, HeroSlide } from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ published: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: slides });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}
