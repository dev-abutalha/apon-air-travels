import { NextResponse } from 'next/server';
import { connectDB } from '@apon-air/database';
import { Contact } from '@apon-air/database';
import { contactSchema } from '@apon-air/lib';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.errors }, { status: 400 });
    }

    const contact = await Contact.create(validation.data);
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
