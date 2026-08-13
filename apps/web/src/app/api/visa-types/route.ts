import { NextResponse } from 'next/server';
import { connectDB, VisaType } from '@apon-air/database';

export async function GET(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const country = url.searchParams.get('country');
    const filter: Record<string, unknown> = { published: true };
    if (country) filter.countryId = country;
    const visaTypes = await VisaType.find(filter).populate('countryId').sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, data: visaTypes });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch visa types' }, { status: 500 });
  }
}
