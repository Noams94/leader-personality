import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, COOKIE_NAME, MAX_AGE } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: 'ADMIN_PASSWORD not configured' }, { status: 500 });
    }

    if (password !== expected) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = createAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
