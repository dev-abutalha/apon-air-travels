import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Media } from '@apon-air/database';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Public-site content is selected in the Admin app but rendered by the Web app.
// Keep a local copy in both public folders so the stored `/uploads/...` URL works
// from either Next.js application during local/self-hosted deployments.
const ADMIN_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const WEB_UPLOAD_DIR = path.resolve(process.cwd(), '../web/public/uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    await Promise.all([
      mkdir(ADMIN_UPLOAD_DIR, { recursive: true }),
      mkdir(WEB_UPLOAD_DIR, { recursive: true }),
    ]);
    await Promise.all([
      writeFile(path.join(ADMIN_UPLOAD_DIR, filename), buffer),
      writeFile(path.join(WEB_UPLOAD_DIR, filename), buffer),
    ]);

    await connectDB();
    const media = await Media.create({
      url: `/uploads/${filename}`,
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
