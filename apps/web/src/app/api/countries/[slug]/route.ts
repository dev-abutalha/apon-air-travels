import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { Country } from '@apon-air/database';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const country = await Country.findOne({ slug }).populate('faq').lean();

    if (!country) {
      return NextResponse.json({ success: false, error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: country });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch country' }, { status: 500 });
  }
}
