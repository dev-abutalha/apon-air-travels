import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { GalleryAlbum } from '@apon-air/database';

export async function GET() {
  await connectDB();
  const albums = await GalleryAlbum.find().sort({ createdAt: -1 });
  return NextResponse.json(albums);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const album = await GalleryAlbum.create(data);
    return NextResponse.json(album, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
