import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@apon-air/database';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const media = await Media.findByIdAndDelete(id);
  if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
