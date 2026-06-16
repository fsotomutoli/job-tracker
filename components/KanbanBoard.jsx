'use client';
import { STATUSES } from '@/lib/constants';
import AppCard from './AppCard';

function KanbanColumn({ status, jobs, onEdit, onStatusChange }) {
  return (
    <div className="column">
      <div className="col-header" style={{ background: status.bg, color: status.color }}>
        <span>{status.emoji} {status.label}</span>
        <span className="col-count">{jobs.length}</span>
      </div>

      {jobs.length === 0
        ? <div className="col-empty">Sin postulaciones</div>
        : jobs.map(job => (
            <AppCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))
      }
    </div>
  );
}

export default function KanbanBoard({ jobs, onEdit, onStatusChange }) {
  return (
    <div className="kanban">
      {STATUSES.map(status => (
        <KanbanColumn
          key={status.id}
          status={status}
          jobs={jobs.filter(j => j.estado === status.id)}
          onEdit={onEdit}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
