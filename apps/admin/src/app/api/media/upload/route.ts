import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@apon-air/database';
import { uploadImage } from '@apon-air/lib';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await uploadImage(dataUri, 'media');

    await connectDB();
    const media = await Media.create({
      url: result.url,
      publicId: result.publicId,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      alt: file.name.replace(/\.[^/.]+$/, ''),
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
