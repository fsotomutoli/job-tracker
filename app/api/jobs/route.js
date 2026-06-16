// Proxy hacia Google Apps Script — mantiene el Script ID (credencial) fuera del cliente
// y solo lo usa para construir la URL en este código server-side.

const SCRIPT_ID = process.env.APPS_SCRIPT_ID;
const SCRIPT_URL = SCRIPT_ID ? `https://script.google.com/macros/s/${SCRIPT_ID}/exec` : undefined;

export async function GET() {
  if (!SCRIPT_URL) {
    return Response.json({ ok: false, error: 'APPS_SCRIPT_ID no configurado' }, { status: 500 });
  }
  try {
    const res = await fetch(SCRIPT_URL, { cache: 'no-store' });
    const json = await res.json();
    return Response.json(json);
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 502 });
  }
}

export async function POST(request) {
  if (!SCRIPT_URL) {
    return Response.json({ ok: false, error: 'APPS_SCRIPT_ID no configurado' }, { status: 500 });
  }
  try {
    const body = await request.json();
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
    });
    const json = await res.json();
    return Response.json(json);
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 502 });
  }
}
