import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { CountryService } from './country.service';

export async function getCountries(request: Request) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const published = url.searchParams.get('published');

    const countries = published === 'true'
      ? await CountryService.getPublishedCountries()
      : await CountryService.getAllCountries();

    return NextResponse.json({ success: true, data: countries });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch countries' }, { status: 500 });
  }
}

export async function getCountry(slug: string) {
  try {
    await connectDB();
    const country = await CountryService.getCountryBySlug(slug);

    if (!country) {
      return NextResponse.json({ success: false, error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: country });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch country' }, { status: 500 });
  }
}

export async function createCountry(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const country = await CountryService.createCountry(body);
    return NextResponse.json({ success: true, data: country }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create country' }, { status: 500 });
  }
}
