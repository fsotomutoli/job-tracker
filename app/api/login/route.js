import { AUTH_COOKIE, getExpectedToken, isValidPassword } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { ok: false, error: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const { password } = await request.json().catch(() => ({}));

  if (!isValidPassword(password)) {
    return Response.json({ ok: false, error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const token  = getExpectedToken();
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  const res = Response.json({ ok: true });
  res.headers.set(
    'Set-Cookie',
    `${AUTH_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure}`
  );
  return res;
}
