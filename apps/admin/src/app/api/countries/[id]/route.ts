import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Country } from '@apon-air/database';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const data = await request.json();
  const country = await Country.findByIdAndUpdate(id, data, { new: true });
  if (!country) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(country);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const country = await Country.findByIdAndDelete(id);
  if (!country) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
