// Cliente para la API /api/jobs (que proxea a Apps Script)

const BASE = '/api/jobs';

export async function fetchJobs() {
  const res = await fetch(BASE, { cache: 'no-store' });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export async function createJob(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'create', data }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export async function updateJob(data) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update', data }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
  return json.data;
}

export async function deleteJob(id) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', id }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error);
}
