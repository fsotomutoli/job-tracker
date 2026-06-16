// Constante compartida sin dependencias de Node, para que tanto el código
// Node (lib/auth.js) como el Edge (lib/auth-edge.js, middleware.js) puedan
// importarla sin arrastrar módulos incompatibles entre runtimes.

export const AUTH_COOKIE = 'job_tracker_auth';
