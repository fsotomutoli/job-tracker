'use client';
import { STATUSES } from '@/lib/constants';

const fmtDate = d => {
  if (!d) return '';
  const [y, m, day] = String(d).split('-');
  return `${day}/${m}/${y}`;
};

const platformClass = p =>
  p === 'LinkedIn' ? 'badge-linkedin' :
  p === 'GetOnBoard' ? 'badge-getonboard' : 'badge-otro';

export default function AppCard({ job, onEdit, onStatusChange }) {
  const idx        = STATUSES.findIndex(s => s.id === job.estado);
  const prevStatus = idx > 0 ? STATUSES[idx - 1] : null;
  const nextStatus = STATUSES[idx + 1] ?? null;

  return (
    <div className="card" onClick={() => onEdit(job)}>
      <div className="card-cargo">{job.cargo}</div>
      <div className="card-empresa">{job.empresa}</div>

      <div className="card-meta">
        <span className={`badge ${platformClass(job.plataforma)}`}>{job.plataforma}</span>
        {job.modalidad && <span className="badge badge-modal">{job.modalidad}</span>}
      </div>

      {job.sueldo && <div className="card-sueldo">💰 {job.sueldo}</div>}
      {job.fechaPostulacion && <div className="card-date">📅 {fmtDate(job.fechaPostulacion)}</div>}
      {job.notas && <div className="card-notes">{job.notas}</div>}

      {/* Botón principal de postulación */}
      {job.link && (
        <a
          className="card-apply"
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          ↗ Postular
        </a>
      )}

      {/* Navegación de estado */}
      <div className="card-actions" onClick={e => e.stopPropagation()}>
        {prevStatus && (
          <button
            className="card-btn"
            title={`← ${prevStatus.label}`}
            onClick={() => onStatusChange(job.id, prevStatus.id)}
          >
            ← {prevStatus.label}
          </button>
        )}
        {nextStatus && (
          <button
            className="card-btn"
            title={`${nextStatus.label} →`}
            onClick={() => onStatusChange(job.id, nextStatus.id)}
          >
            {nextStatus.label} →
          </button>
        )}
      </div>
    </div>
  );
}
