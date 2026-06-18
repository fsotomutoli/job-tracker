'use client';
import { useState } from 'react';
import { STATUSES, PLATFORMS, MODALITIES, EMPTY_FORM } from '@/lib/constants';

export default function AppModal({ initial, onSave, onClose, onDiscard, saving }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState(
    initial ?? { ...EMPTY_FORM, fechaPostulacion: today }
  );
  const [confirmDel, setConfirmDel] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isEdit  = Boolean(initial);
  const canSave = form.cargo.trim() && form.empresa.trim();

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{isEdit ? 'Editar postulación' : 'Nueva postulación'}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-group full">
              <label className="form-label">Cargo *</label>
              <input className="form-input" value={form.cargo}
                onChange={e => set('cargo', e.target.value)}
                placeholder="Product Manager" />
            </div>
            <div className="form-group full">
              <label className="form-label">Empresa *</label>
              <input className="form-input" value={form.empresa}
                onChange={e => set('empresa', e.target.value)}
                placeholder="Google" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Plataforma</label>
              <select className="form-select" value={form.plataforma}
                onChange={e => set('plataforma', e.target.value)}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select className="form-select" value={form.estado}
                onChange={e => set('estado', e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Modalidad</label>
              <select className="form-select" value={form.modalidad}
                onChange={e => set('modalidad', e.target.value)}>
                {MODALITIES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha postulación</label>
              <input type="date" className="form-input" value={form.fechaPostulacion}
                onChange={e => set('fechaPostulacion', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sueldo estimado</label>
              <input className="form-input" value={form.sueldo}
                onChange={e => set('sueldo', e.target.value)}
                placeholder="2.4M–2.6M CLP" />
            </div>
            <div className="form-group">
              <label className="form-label">Fit (0-100)</label>
              <input type="number" min="0" max="100" className="form-input" value={form.fit}
                onChange={e => set('fit', e.target.value)}
                placeholder="80" />
            </div>
          </div>

          <div className="form-group full">
            <label className="form-label">Link vacante</label>
            <input className="form-input" value={form.link}
              onChange={e => set('link', e.target.value)}
              placeholder="https://..." />
          </div>

          <div className="form-group">
            <label className="form-label">Notas</label>
            <textarea className="form-textarea" value={form.notas}
              onChange={e => set('notas', e.target.value)}
              placeholder="Requisitos clave, contacto, próximos pasos..." />
          </div>

          {isEdit && (
            <div className="delete-zone">
              {!confirmDel
                ? <button className="btn btn-discard" onClick={() => setConfirmDel(true)}>
                    🚫 No me interesa
                  </button>
                : <div className="confirm-row">
                    <span className="confirm-msg">¿Descartar esta oferta?</span>
                    <button className="btn btn-discard" onClick={onDiscard}>Sí, descartar</button>
                    <button className="btn btn-ghost" onClick={() => setConfirmDel(false)}>Cancelar</button>
                  </div>
              }
            </div>
          )}
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button
            className="btn btn-primary"
            onClick={() => canSave && onSave(form)}
            disabled={!canSave || saving}
          >
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : '+ Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
