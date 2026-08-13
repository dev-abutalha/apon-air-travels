import { NextResponse } from 'next/server';
import { connectDB, BlogPost } from '@apon-air/database';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    if (!post) return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch post' }, { status: 500 });
  }
}
