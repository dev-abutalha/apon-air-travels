import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { FAQ } from '@apon-air/database';

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const category = url.searchParams.get('category');

    const filter: Record<string, unknown> = { published: true };
    if (category) filter.category = category;

    const faqs = await FAQ.find(filter).sort({ category: 1, order: 1 }).lean();
    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}
