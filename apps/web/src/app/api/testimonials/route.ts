import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { Testimonial } from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ published: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
