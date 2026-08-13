import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Testimonial } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  await connectDB();
  const data = await request.json();
  const testimonial = await Testimonial.create(data);
  return NextResponse.json(testimonial, { status: 201 });
}
