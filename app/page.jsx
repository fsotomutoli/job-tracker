'use client';
import { useState, useEffect, useCallback } from 'react';
import StatsBar    from '@/components/StatsBar';
import Controls    from '@/components/Controls';
import KanbanBoard from '@/components/KanbanBoard';
import AppModal    from '@/components/AppModal';
import { fetchJobs, createJob, updateJob, deleteJob } from '@/lib/api';
import { STATUSES } from '@/lib/constants';

// ── Helpers ────────────────────────────────────────────────────────────────

function uid() {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function exportCSV(jobs) {
  const cols = ['Cargo','Empresa','Plataforma','Estado','Modalidad','Sueldo','Fecha','Link','Notas'];
  const rows = jobs.map(j => [
    j.cargo, j.empresa, j.plataforma,
    STATUSES.find(s => s.id === j.estado)?.label ?? j.estado,
    j.modalidad, j.sueldo, j.fechaPostulacion, j.link,
    (j.notas ?? '').replace(/\n/g, ' '),
  ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
  const csv  = [cols.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: 'postulaciones.csv' }).click();
  URL.revokeObjectURL(url);
}

// ── Page component ─────────────────────────────────────────────────────────

export default function Home() {
  const [jobs,         setJobs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [modal,        setModal]        = useState(null);   // null | 'new' | job object
  const [search,       setSearch]       = useState('');
  const [filterPlat,   setFilterPlat]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // ── Load
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setJobs(await fetchJobs());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  // ── CRUD
  async function handleSave(form) {
    setSaving(true);
    try {
      if (modal === 'new') {
        const newJob = { ...form, id: uid(), createdAt: new Date().toISOString() };
        await createJob(newJob);
        setJobs(prev => [newJob, ...prev]);
      } else {
        const updated = { ...modal, ...form };
        await updateJob(updated);
        setJobs(prev => prev.map(j => j.id === updated.id ? updated : j));
      }
      setModal(null);
    } catch (e) {
      alert('Error guardando: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      await deleteJob(modal.id);
      setJobs(prev => prev.filter(j => j.id !== modal.id));
      setModal(null);
    } catch (e) {
      alert('Error eliminando: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id, estado) {
    const job     = jobs.find(j => j.id === id);
    const updated = { ...job, estado };
    setJobs(prev => prev.map(j => j.id === id ? updated : j));   // optimistic
    try {
      await updateJob(updated);
    } catch (e) {
      setJobs(prev => prev.map(j => j.id === id ? job : j));     // rollback
    }
  }

  // ── Filter
  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return (
      (!q || j.cargo.toLowerCase().includes(q) || j.empresa.toLowerCase().includes(q)) &&
      (!filterPlat   || j.plataforma === filterPlat) &&
      (!filterStatus || j.estado     === filterStatus)
    );
  });

  // ── Render
  if (loading) return (
    <>
      <header className="header">
        <div className="header-brand">
          <span className="header-title">🎯 Job Tracker</span>
          <span className="header-sub">Francisco Soto Mutoli · Santiago, Chile</span>
        </div>
      </header>
      <div className="center-msg">Cargando postulaciones…</div>
    </>
  );

  if (error) return (
    <>
      <header className="header">
        <div className="header-brand">
          <span className="header-title">🎯 Job Tracker</span>
          <span className="header-sub">Francisco Soto Mutoli · Santiago, Chile</span>
        </div>
      </header>
      <div className="center-msg" style={{ color: '#ef4444' }}>
        <span>⚠️ Error cargando datos</span>
        <span style={{ fontSize: 12 }}>{error}</span>
        <button className="btn btn-primary" onClick={loadJobs}>Reintentar</button>
      </div>
    </>
  );

  return (
    <>
      <header className="header">
        <div className="header-brand">
          <span className="header-title">🎯 Job Tracker</span>
          <span className="header-sub">Francisco Soto Mutoli · Santiago, Chile</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost-white" onClick={loadJobs}>↺ Actualizar</button>
        </div>
      </header>

      <StatsBar jobs={jobs} />

      <Controls
        search={search}           setSearch={setSearch}
        filterPlat={filterPlat}   setFilterPlat={setFilterPlat}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        onAdd={() => setModal('new')}
        onExport={() => exportCSV(jobs)}
      />

      <KanbanBoard
        jobs={filtered}
        onEdit={setModal}
        onStatusChange={handleStatusChange}
      />

      {modal && (
        <AppModal
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          onDelete={handleDelete}
          saving={saving}
        />
      )}
    </>
  );
}
