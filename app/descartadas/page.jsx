'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchJobs, updateJob, deleteJob } from '@/lib/api';
import { DISCARD_STATUS } from '@/lib/constants';

const fmtDate = d => {
  if (!d) return '';
  const [y, m, day] = String(d).split('-');
  return `${day}/${m}/${y}`;
};

const platformClass = p =>
  p === 'LinkedIn' ? 'badge-linkedin' :
  p === 'GetOnBoard' ? 'badge-getonboard' : 'badge-otro';

export default function Descartadas() {
  const router = useRouter();
  const [jobs,    setJobs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [confirm, setConfirm] = useState(null); // id del job a eliminar de verdad

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const all = await fetchJobs();
      setJobs(all.filter(j => j.estado === DISCARD_STATUS));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  async function handleRestore(job) {
    const updated = { ...job, estado: 'interesado' };
    setJobs(prev => prev.filter(j => j.id !== job.id));
    try {
      await updateJob(updated);
    } catch (e) {
      setJobs(prev => [job, ...prev]);
      alert('Error restaurando: ' + e.message);
    }
  }

  async function handleDelete(id) {
    setJobs(prev => prev.filter(j => j.id !== id));
    setConfirm(null);
    try {
      await deleteJob(id);
    } catch (e) {
      alert('Error eliminando: ' + e.message);
      loadJobs();
    }
  }

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  }

  const header = (
    <header className="header">
      <div className="header-brand">
        <span className="header-title">🎯 Job Tracker</span>
        <span className="header-sub">Francisco Soto Mutoli · Santiago, Chile</span>
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost-white" onClick={loadJobs}>↺ Actualizar</button>
        <button className="btn btn-ghost-white" onClick={handleLogout}>Salir</button>
      </div>
    </header>
  );

  if (loading) return (
    <>
      {header}
      <div className="center-msg">Cargando…</div>
    </>
  );

  if (error) return (
    <>
      {header}
      <div className="center-msg" style={{ color: '#ef4444' }}>
        <span>⚠️ Error cargando datos</span>
        <span style={{ fontSize: 12 }}>{error}</span>
        <button className="btn btn-primary" onClick={loadJobs}>Reintentar</button>
      </div>
    </>
  );

  return (
    <>
      {header}

      <nav className="nav-tabs">
        <Link href="/" className="nav-tab">Postulaciones</Link>
        <span className="nav-tab nav-tab-active">No me interesa</span>
      </nav>

      <div className="discard-page">
        <div className="discard-header">
          <h2 className="discard-title">🚫 Ofertas descartadas</h2>
          <span className="discard-count">{jobs.length} oferta{jobs.length !== 1 ? 's' : ''}</span>
        </div>
        <p className="discard-hint">
          Estas ofertas no volverán a aparecer en el tablero. Puedes restaurarlas si cambias de opinión.
        </p>

        {jobs.length === 0 ? (
          <div className="center-msg" style={{ height: 'auto', marginTop: 60 }}>
            Sin ofertas descartadas
          </div>
        ) : (
          <div className="discard-grid">
            {jobs.map(job => (
              <div key={job.id} className="discard-card">
                <div className="card-cargo">{job.cargo}</div>
                <div className="card-empresa">{job.empresa}</div>

                <div className="card-meta" style={{ marginTop: 8 }}>
                  <span className={`badge ${platformClass(job.plataforma)}`}>{job.plataforma}</span>
                  {job.modalidad && <span className="badge badge-modal">{job.modalidad}</span>}
                </div>

                {job.sueldo && <div className="card-sueldo">💰 {job.sueldo}</div>}
                {job.fechaPostulacion && <div className="card-date">📅 {fmtDate(job.fechaPostulacion)}</div>}

                {job.link && (
                  <a
                    className="card-apply"
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginTop: 10 }}
                  >
                    ↗ Ver oferta
                  </a>
                )}

                <div className="discard-actions">
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => handleRestore(job)}
                  >
                    ↩ Restaurar
                  </button>
                  {confirm === job.id ? (
                    <>
                      <button
                        className="btn btn-danger-soft"
                        onClick={() => handleDelete(job.id)}
                      >
                        Sí, eliminar
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setConfirm(null)}
                      >
                        No
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-ghost"
                      title="Eliminar definitivamente"
                      onClick={() => setConfirm(job.id)}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
