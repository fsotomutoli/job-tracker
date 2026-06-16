// Helpers de autenticación compartidos entre la API de login y el middleware.
// La contraseña (APP_PASSWORD) nunca se guarda en la cookie ni se envía al cliente:
// la cookie solo lleva un HMAC derivado de ella, verificable de forma stateless.

import crypto from 'crypto';

export { AUTH_COOKIE } from './authConstants';

export function getExpectedToken() {
  const secret = process.env.APP_PASSWORD;
  if (!secret) return null;
  return crypto.createHmac('sha256', secret).update('job-tracker-auth-v1').digest('hex');
}

export function isValidPassword(candidate) {
  const secret = process.env.APP_PASSWORD;
  if (!secret || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false; // evita filtrar largo via timing
  return crypto.timingSafeEqual(a, b);
}
