'use client';
import { STATUSES } from '@/lib/constants';

export default function StatsBar({ jobs }) {
  const total       = jobs.length;
  const postulados  = jobs.filter(j => !['interesado', 'rechazado'].includes(j.estado)).length;
  const enProceso   = jobs.filter(j => ['en_proceso', 'entrevista'].includes(j.estado)).length;
  const entrevistas = jobs.filter(j => j.estado === 'entrevista').length;
  const ofertas     = jobs.filter(j => j.estado === 'oferta').length;

  const items = [
    { value: total,       label: 'Total' },
    null,
    { value: postulados,  label: 'Postulados' },
    null,
    { value: enProceso,   label: 'En proceso' },
    null,
    { value: entrevistas, label: 'Entrevistas' },
    null,
    { value: ofertas,     label: 'Ofertas 🎉' },
  ];

  return (
    <div className="stats-bar">
      {items.map((item, i) =>
        item === null
          ? <div key={i} className="stat-divider" />
          : (
            <div key={i} className="stat">
              <span className="stat-value">{item.value}</span>
              <span className="stat-label">{item.label}</span>
            </div>
          )
      )}
    </div>
  );
}
