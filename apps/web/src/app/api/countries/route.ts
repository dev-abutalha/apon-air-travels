import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { Country } from '@apon-air/database';

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const published = url.searchParams.get('published');

    const filter = published === 'true' ? { published: true } : {};
    const countries = await Country.find(filter).sort({ order: 1 }).lean();

    return NextResponse.json({ success: true, data: countries });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch countries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const country = await Country.create(body);
    return NextResponse.json({ success: true, data: country }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create country' }, { status: 500 });
  }
}
