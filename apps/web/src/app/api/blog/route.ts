import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { BlogPost } from '@apon-air/database';

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');

    const filter: Record<string, unknown> = { published: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const posts = await BlogPost.find(filter).sort({ publishedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
