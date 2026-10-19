import { cn } from '@/lib/utils';

/**
 * Abanico — o leque da bailaora, que abre com o scroll.
 *
 * Cada vareta é uma prega (cunha) que gira em torno do pino. A abertura vem da
 * variável CSS `--open` (0 fechado, 1 aberto), que a cena anima com o GSAP:
 * o leque inteiro é CSS + SVG, sem canvas. As pregas alternam vinho e carmim
 * com lunares, e a borda é dourada.
 */
export interface AbanicoProps {
  className?: string;
  /** Número de pregas. */
  pleats?: number;
  /** Abertura total em graus quando `--open` = 1. */
  spread?: number;
}

export function Abanico({ className, pleats = 15, spread = 170 }: AbanicoProps) {
  const R = 96;
  const r = 26;
  const step = spread / pleats;
  // Uma prega: cunha de `step` graus apontando para cima, do miolo até a borda.
  const half = ((step / 2) * Math.PI) / 180;
  const p = (rad: number, a: number) => `${(100 + Math.sin(a) * rad).toFixed(2)} ${(100 - Math.cos(a) * rad).toFixed(2)}`;
  const wedge = `M${p(r, -half)} L${p(R, -half)} A${R} ${R} 0 0 1 ${p(R, half)} L${p(r, half)} A${r} ${r} 0 0 0 ${p(r, -half)} Z`;

  return (
    <svg viewBox="0 0 200 110" aria-hidden="true" className={cn('block overflow-visible', className)}>
      <defs>
        <pattern id="abanico-lunares" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.6" fill="#fbf1e3" fillOpacity="0.55" />
        </pattern>
      </defs>
      {Array.from({ length: pleats }, (_, i) => {
        const angle = (i - (pleats - 1) / 2) * step;
        return (
          <g
            key={i}
            style={{
              transformOrigin: '100px 100px',
              transform: `rotate(calc(var(--open, 1) * ${angle.toFixed(2)}deg))`,
            }}
          >
            <path d={wedge} fill={i % 2 ? '#a52023' : '#4a0710'} />
            {i % 2 === 0 && <path d={wedge} fill="url(#abanico-lunares)" />}
            <path d={`M${p(r - 6, 0)} L${p(R + 3, 0)}`} stroke="#c4893a" strokeWidth="0.9" />
          </g>
        );
      })}
      {/* Borda de renda dourada e o pino. */}
      <path
        d={`M${p(R, (-spread / 2) * (Math.PI / 180))} A${R} ${R} 0 0 1 ${p(R, (spread / 2) * (Math.PI / 180))}`}
        fill="none"
        stroke="#e8b25e"
        strokeWidth="2"
        strokeDasharray="3 2"
        style={{ opacity: 'var(--open, 1)' }}
      />
      <circle cx="100" cy="100" r="5" fill="#e8b25e" />
      <circle cx="100" cy="100" r="2" fill="#2b0307" />
    </svg>
  );
}
