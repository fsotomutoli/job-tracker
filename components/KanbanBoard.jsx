'use client';
import { useState } from 'react';
import {
  DndContext, DragOverlay, useDroppable,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { STATUSES } from '@/lib/constants';
import AppCard from './AppCard';

function KanbanColumn({ status, jobs, onEdit, onStatusChange }) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });

  return (
    <div ref={setNodeRef} className={`column ${isOver ? 'column-over' : ''}`}>
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
  const [activeJob, setActiveJob] = useState(null);

  // distance mínima antes de considerarlo drag: así un click normal sobre
  // la card (para editar) o sobre sus botones no se confunde con un arrastre.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  function handleDragStart({ active }) {
    setActiveJob(jobs.find(j => j.id === active.id) ?? null);
  }

  function handleDragEnd({ active, over }) {
    setActiveJob(null);
    if (!over) return;
    const job = jobs.find(j => j.id === active.id);
    if (job && job.estado !== over.id) {
      onStatusChange(job.id, over.id);
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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

      <DragOverlay>
        {activeJob && <AppCard job={activeJob} dragPreview />}
      </DragOverlay>
    </DndContext>
  );
}
