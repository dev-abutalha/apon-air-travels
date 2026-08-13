import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { VisaType } from '@apon-air/database';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const data = await request.json();
  const vt = await VisaType.findByIdAndUpdate(id, data, { new: true });
  if (!vt) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(vt);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const vt = await VisaType.findByIdAndDelete(id);
  if (!vt) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
