import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@apon-air/database';
import { hashPassword } from '@apon-air/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const data = await request.json();
    if (data.password) {
      data.password = await hashPassword(data.password);
    } else {
      delete data.password;
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
