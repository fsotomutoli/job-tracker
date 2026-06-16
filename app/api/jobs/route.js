// Proxy hacia Google Apps Script — mantiene la URL del script fuera del cliente.

const SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export async function GET() {
  if (!SCRIPT_URL) {
    return Response.json({ ok: false, error: 'APPS_SCRIPT_URL no configurada' }, { status: 500 });
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
    return Response.json({ ok: false, error: 'APPS_SCRIPT_URL no configurada' }, { status: 500 });
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
