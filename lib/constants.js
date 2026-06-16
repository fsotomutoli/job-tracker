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

export const EMPTY_FORM = {
  cargo: '', empresa: '', plataforma: 'LinkedIn', link: '',
  fechaPostulacion: '',   // se rellena en componente con fecha de hoy
  modalidad: 'Híbrido', sueldo: '', estado: 'interesado', notas: '',
};
