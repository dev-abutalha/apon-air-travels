import { NextResponse } from 'next/server';
import { connectDB, GalleryAlbum } from '@apon-air/database';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const album = await GalleryAlbum.findOne({ slug, published: true }).lean();
    if (!album) return NextResponse.json({ success: false, error: 'Album not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: album });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch album' }, { status: 500 });
  }
}
