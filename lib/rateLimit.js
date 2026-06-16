// Rate limiting en memoria para /api/login. No es distribuido (cada instancia
// de función tiene su propio mapa), pero con Fluid Compute reusando instancias
// es suficiente para frenar fuerza bruta básica sobre un endpoint de baja
// frecuencia de uso legítimo. Si se necesita algo más robusto entre todas las
// instancias, migrar a Vercel KV/Upstash.

const WINDOW_MS   = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5;

const attempts = new Map(); // ip -> { count, resetAt }

export function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true };
}
