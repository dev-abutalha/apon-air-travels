import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { GalleryAlbum } from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();
    const albums = await GalleryAlbum.find({ published: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: albums });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery' }, { status: 500 });
  }
}
