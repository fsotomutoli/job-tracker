# 🎯 Job Tracker

Kanban para llevar el seguimiento de postulaciones laborales. Next.js (App
Router) en el frontend, y un Google Sheet como base de datos a través de un
Web App de Google Apps Script.

Demo: https://job-tracker-psi-sandy.vercel.app *(protegido con contraseña)*

## Arquitectura

```
Browser ── /api/jobs ──► Next.js Route Handler ──► Google Apps Script ──► Google Sheet
              (proxy server-side, nunca expone el script ID al cliente)
```

- El frontend nunca llama directo a Apps Script: pega a `/api/jobs`, que vive
  en `app/api/jobs/route.js` y reenvía la request desde el servidor.
- El identificador del Web App de Apps Script se guarda como **`APPS_SCRIPT_ID`**
  (solo el ID, no la URL completa) y la URL se reconstruye en el backend. Esto
  evita que una variable de entorno filtrada sea directamente una URL
  funcional copiable.
- Toda la app (página + API) está protegida con una contraseña compartida
  (`APP_PASSWORD`), implementada en `middleware.js`. Sin sesión válida,
  cualquier ruta redirige a `/login` (páginas) o responde `401` (API).

## Stack

- [Next.js 14](https://nextjs.org) (App Router, JavaScript)
- Google Apps Script + Google Sheets como backend
- Deploy en [Vercel](https://vercel.com)

## Montar tu propio dashboard

### 1. El backend en Google Apps Script

Necesitas un Google Sheet + un Web App de Apps Script que expongan este
contrato (es lo que espera `lib/api.js`):

- **`GET`** → `{ "ok": true, "data": [ {...job}, ... ] }`
- **`POST`** con body `{ "action": "create", "data": {...job} }` → crea una fila,
  devuelve `{ "ok": true, "data": {...job} }`
- **`POST`** con body `{ "action": "update", "data": {...job} }` → actualiza por
  `id`, devuelve `{ "ok": true, "data": {...job} }`
- **`POST`** con body `{ "action": "delete", "id": "..." }` → borra por `id`,
  devuelve `{ "ok": true }`
- En cualquier error: `{ "ok": false, "error": "mensaje" }`

Cada `job` tiene esta forma (ver `lib/constants.js`):

```js
{
  id, cargo, empresa, plataforma,       // 'LinkedIn' | 'GetOnBoard' | 'Otro'
  link, fechaPostulacion, modalidad,    // 'Híbrido' | 'Presencial' | 'Remoto'
  sueldo, estado,                       // ver STATUSES en lib/constants.js
  notas, createdAt,
}
```

Implementa esa lógica en tu propio `Code.gs` (no está en este repo porque
vive en el editor de Apps Script de Google), despliégalo como **Web App**
(acceso: "Cualquiera con el enlace") y copia el **Script ID** de la URL que
te entrega — es la parte entre `/s/` y `/exec`:

```
https://script.google.com/macros/s/AQUÍ_VA_EL_SCRIPT_ID/exec
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

| Variable          | Qué es                                                                 |
|--------------------|-------------------------------------------------------------------------|
| `APPS_SCRIPT_ID`   | Solo el ID del paso anterior (no la URL completa)                      |
| `APP_PASSWORD`     | Contraseña para entrar al dashboard. Usa algo con buena entropía, ej. `openssl rand -base64 12` |

### 3. Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` — te va a pedir la contraseña de `APP_PASSWORD`.

### 4. Deploy a Vercel

```bash
npm i -g vercel   # si no la tienes
vercel link
vercel env add APPS_SCRIPT_ID production
vercel env add APP_PASSWORD production
vercel --prod
```

Agrega las mismas variables también con scope **Preview** desde el dashboard
de Vercel (Project Settings → Environment Variables) si vas a usar preview
deployments.

## Seguridad

- El script ID nunca se expone al cliente (no hay `NEXT_PUBLIC_*` para esto).
- `/api/login` tiene rate limiting (5 intentos cada 15 minutos por IP).
- La cookie de sesión es un HMAC-SHA256 derivado de `APP_PASSWORD`, nunca la
  contraseña en texto plano.
- `.env.local` nunca debe subirse al repo (ya está en `.gitignore`).
