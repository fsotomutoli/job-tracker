'use client';
import { fitColor } from '@/lib/constants';

const SIZE   = 38;
const STROKE = 4;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC   = 2 * Math.PI * RADIUS;

// Anillo de progreso (0-100) con el número al centro. El color cambia por
// banda (rojo/naranjo/amarillo/verde) según lib/constants.js#FIT_BANDS.
export default function FitGauge({ fit }) {
  const value  = Math.max(0, Math.min(100, Number(fit) || 0));
  const color  = fitColor(value);
  const offset = CIRC - (value / 100) * CIRC;

  return (
    <div className="fit-gauge" title={`Fit: ${value}/100`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none" stroke="var(--border)" strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
          fill="none" stroke={color} strokeWidth={STROKE}
          strokeDasharray={CIRC} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s, stroke 0.3s' }}
        />
      </svg>
      <span className="fit-gauge-value" style={{ color }}>{value}</span>
    </div>
  );
}
