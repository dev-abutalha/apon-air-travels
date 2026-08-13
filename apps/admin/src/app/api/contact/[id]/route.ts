import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Contact } from '@apon-air/database';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const data = await request.json();
    const message = await Contact.findByIdAndUpdate(id, data, { new: true });
    if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const message = await Contact.findByIdAndDelete(id);
    if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
