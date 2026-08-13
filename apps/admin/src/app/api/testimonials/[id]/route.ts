import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Testimonial } from '@apon-air/database';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const data = await request.json();
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(testimonial);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const testimonial = await Testimonial.findByIdAndDelete(id);
  if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
