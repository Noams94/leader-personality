import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_token';
const MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

export async function verifyAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    const dotIndex = token.indexOf('.');
    if (dotIndex === -1) return false;
    const timestamp = token.slice(0, dotIndex);
    const hash = token.slice(dotIndex + 1);
    const expected = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
    if (hash !== expected) return false;

    // Check expiry
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts) || Date.now() - ts > MAX_AGE * 1000) return false;

    return true;
  } catch {
    return false;
  }
}

export function createAdminToken(): string {
  const secret = process.env.ADMIN_PASSWORD!;
  const timestamp = Date.now().toString();
  const hash = crypto.createHmac('sha256', secret).update(timestamp).digest('hex');
  return `${timestamp}.${hash}`;
}

export { COOKIE_NAME, MAX_AGE };
