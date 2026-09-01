import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@apon-air/database';
import { deleteAsset } from '@apon-air/lib';

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const media = await Media.findByIdAndDelete(id);
  if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (media.publicId) {
    try {
      await deleteAsset(media.publicId);
    } catch (e) {
      // ignore Cloudinary delete errors; DB record already removed
    }
  }
  return NextResponse.json({ ok: true });
}
