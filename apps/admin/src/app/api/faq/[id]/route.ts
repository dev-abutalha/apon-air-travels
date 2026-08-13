import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { FAQ } from '@apon-air/database';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const data = await request.json();
  const faq = await FAQ.findByIdAndUpdate(id, data, { new: true });
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(faq);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const faq = await FAQ.findByIdAndDelete(id);
  if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
