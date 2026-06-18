export const DISCARD_STATUS = 'no_interesa';

export const STATUSES = [
  { id: 'interesado', label: 'Interesado',  emoji: '👀', color: '#6366f1', bg: '#eef2ff' },
  { id: 'postulado',  label: 'Postulado',   emoji: '📤', color: '#0ea5e9', bg: '#e0f2fe' },
  { id: 'en_proceso', label: 'En proceso',  emoji: '⏳', color: '#f59e0b', bg: '#fef3c7' },
  { id: 'entrevista', label: 'Entrevista',  emoji: '🎙️', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'oferta',     label: 'Oferta',      emoji: '🎉', color: '#10b981', bg: '#d1fae5' },
  { id: 'rechazado',  label: 'Rechazado',   emoji: '❌', color: '#94a3b8', bg: '#f1f5f9' },
];

export const PLATFORMS  = ['LinkedIn', 'GetOnBoard', 'Otro'];
export const MODALITIES = ['Híbrido', 'Presencial', 'Remoto'];

// Bandas de color del medidor de fit (0-100). Se evalúan en orden, la
// primera cuyo "max" cubre el valor define el color.
export const FIT_BANDS = [
  { max: 25, color: '#ef4444' }, // rojo
  { max: 50, color: '#f97316' }, // naranjo
  { max: 74, color: '#eab308' }, // amarillo
  { max: Infinity, color: '#22c55e' }, // verde (75+)
];

export function fitColor(fit) {
  return FIT_BANDS.find(b => fit <= b.max).color;
}

export const EMPTY_FORM = {
  cargo: '', empresa: '', plataforma: 'LinkedIn', link: '',
  fechaPostulacion: '',   // se rellena en componente con fecha de hoy
  modalidad: 'Híbrido', sueldo: '', estado: 'interesado', notas: '', fit: '',
};
