import { useRef } from 'react';
import { createColorReader, useCanvas } from '@/hooks/useCanvas';
import { cn } from '@/lib/utils';

/**
 * Lunares — as bolinhas do vestido de flamenca, marcando o compás.
 *
 * Uma trama de pontos em que uma onda diagonal percorre os 12 tempos da soleá;
 * nos tempos acentuados (3, 6, 8, 10 e 12) os lunares crescem e ficam dourados,
 * como as palmas fortes do ciclo. O cursor abre uma roda de pontos maiores à
 * sua volta. É o ritmo do flamenco desenhado, não enfeite: quem conta junto
 * percebe o compás.
 */

/** Tempos acentuados do compás de 12 (soleá, alegrías, bulerías), base 0. */
const ACCENTS = new Set([2, 5, 7, 9, 11]);
/** Tempos por segundo: uma soleá tranquila (~120 bpm). */
const BEATS_PER_SECOND = 2;

export interface LunaresProps {
  className?: string;
  /** Distância entre os lunares em px CSS. */
  gap?: number;
  /** Raio de repouso em px CSS. */
  radius?: number;
}

export function Lunares({ className, gap = 34, radius = 2.2 }: LunaresProps) {
  const readColors = useRef(createColorReader()).current;
  const ref = useCanvas(
    (ctx, { width, height, time, pointer, first }) => {
      ctx.clearRect(0, 0, width, height);
      const { ink } = readColors(ctx.canvas, first);
      const gold = '#e8b25e';
      const cols = Math.ceil(width / gap) + 1;
      const rows = Math.ceil(height / gap) + 1;
      const beat = time * BEATS_PER_SECOND;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Deslocamento meio passo nas linhas ímpares: a trama do tecido.
          const x = col * gap + (row % 2 ? gap / 2 : 0);
          const y = row * gap;
          const step = (col + row) % 12;
          // Tempos desde que a "palma" passou por este lunar.
          const since = (((beat - step) % 12) + 12) % 12;
          const hit = Math.exp(-since * 2.4);
          const accent = ACCENTS.has(step);
          let r = radius + hit * (accent ? radius * 2.4 : radius * 0.9);
          if (pointer.active) {
            const d = Math.hypot(pointer.x - x, pointer.y - y);
            r += Math.max(0, 1 - d / 140) * radius * 1.6;
          }
          ctx.globalAlpha = accent ? 0.35 + hit * 0.65 : 0.22 + hit * 0.4;
          ctx.fillStyle = accent && hit > 0.08 ? gold : ink;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
    { stillTime: 5.6, deps: [gap, radius] },
  );

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none block h-full w-full', className)} />;
}
