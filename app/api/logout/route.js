import { AUTH_COOKIE } from '@/lib/auth';

export async function POST() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const res = Response.json({ ok: true });
  res.headers.set('Set-Cookie', `${AUTH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
  return res;
}
