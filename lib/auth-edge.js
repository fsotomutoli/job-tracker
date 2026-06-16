// Misma derivación de token que lib/auth.js, pero usando Web Crypto (SubtleCrypto)
// en vez del módulo 'crypto' de Node, porque este archivo lo consume middleware.js,
// que corre en el Edge Runtime y no soporta módulos nativos de Node.

const MESSAGE = 'job-tracker-auth-v1';

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getExpectedTokenEdge(secret) {
  if (!secret) return null;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(MESSAGE));
  return toHex(signature);
}
