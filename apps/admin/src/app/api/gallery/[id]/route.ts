import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GalleryAlbum } from '@apon-air/database';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const data = await request.json();
    const album = await GalleryAlbum.findByIdAndUpdate(id, data, { new: true });
    if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const album = await GalleryAlbum.findByIdAndDelete(id);
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
