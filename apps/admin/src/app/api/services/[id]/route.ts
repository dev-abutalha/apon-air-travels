import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Service } from '@apon-air/database';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const data = await request.json();
  const service = await Service.findByIdAndUpdate(id, data, { new: true });
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(service);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const service = await Service.findByIdAndDelete(id);
  if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
