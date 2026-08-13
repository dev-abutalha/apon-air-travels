import { NextResponse } from 'next/server';
import { connectDB, Page } from '@apon-air/database';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const page = await Page.findOne({ slug, published: true }).lean();
    if (!page) return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: page });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch page' }, { status: 500 });
  }
}
