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

const REJECTED_ID = 'rechazado';

export default function AppCard({ job, onEdit, onStatusChange }) {
  const idx        = STATUSES.findIndex(s => s.id === job.estado);
  const prevStatus = idx > 0 ? STATUSES[idx - 1] : null;
  const nextStatus = STATUSES[idx + 1] ?? null;

  // Antes de postular el link lleva a la oferta para aplicar; una vez
  // postulado, el mismo link solo sirve para volver a revisarla.
  const linkLabel = job.estado === 'interesado' ? '↗ Postular' : '↗ Ver oferta';

  // Acceso directo a "Rechazado" desde cualquier estado (rechazo explícito o
  // ghosteo). Se oculta si ya está rechazado o si el botón "siguiente" ya
  // apunta a rechazado (pasa al llegar desde "Oferta"), para no duplicar.
  const showReject = job.estado !== REJECTED_ID && nextStatus?.id !== REJECTED_ID;

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

      {/* Botón principal: postular (antes) o ver la oferta (después) */}
      {job.link && (
        <a
          className="card-apply"
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          {linkLabel}
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
        {showReject && (
          <button
            className="card-btn card-btn-reject"
            title="Marcar como rechazado / sin respuesta"
            onClick={() => onStatusChange(job.id, REJECTED_ID)}
          >
            ❌ Rechazar
          </button>
        )}
      </div>
    </div>
  );
}
