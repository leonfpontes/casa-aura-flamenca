import { useRef } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { createRandom } from '@/lib/art/random';
import { cn } from '@/lib/utils';

/**
 * Mantón de Manila — o xale bordado que a bailaora gira no baile.
 *
 * Uma faixa de seda com flores bordadas (rosas e cravos em ouro, marfim e
 * carmim) e, embaixo, os flecos: centenas de fios que balançam com o vento
 * do scroll (rolar rápido os joga para o lado) e se abrem à passagem do cursor.
 */

interface Flower {
  x: number;
  y: number;
  r: number;
  kind: 'rosa' | 'clavel';
  color: string;
  rot: number;
}

interface Thread {
  x: number;
  len: number;
  phase: number;
  /** Deslocamento atual da ponta (px), com inércia. */
  sway: number;
}

interface State {
  key: string;
  flowers: Flower[];
  threads: Thread[];
  lastScroll: number;
  wind: number;
}

const SILK = '#4a0710';
const SILK_DARK = '#2b0307';
const GOLD = '#e8b25e';
const GOLD_LIGHT = '#fbd99a';
const IVORY = '#fbf1e3';
const CARMIM = '#a52023';

/** Rosa bordada: pétalas em espiral (arcos concêntricos) — o ponto do bordado. */
function rosa(c: CanvasRenderingContext2D, f: Flower) {
  c.save();
  c.translate(f.x, f.y);
  c.rotate(f.rot);
  c.fillStyle = f.color;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    c.beginPath();
    c.ellipse(Math.cos(a) * f.r * 0.45, Math.sin(a) * f.r * 0.45, f.r * 0.55, f.r * 0.38, a, 0, Math.PI * 2);
    c.fill();
  }
  c.strokeStyle = SILK_DARK;
  c.lineWidth = Math.max(1, f.r * 0.08);
  c.beginPath();
  for (let t = 0; t < Math.PI * 4; t += 0.2) {
    const rr = (t / (Math.PI * 4)) * f.r * 0.5;
    c.lineTo(Math.cos(t) * rr, Math.sin(t) * rr);
  }
  c.stroke();
  c.restore();
}

/** Cravo: leque de pétalas serrilhadas. */
function clavel(c: CanvasRenderingContext2D, f: Flower) {
  c.save();
  c.translate(f.x, f.y);
  c.rotate(f.rot);
  c.fillStyle = f.color;
  c.beginPath();
  c.moveTo(0, f.r * 0.5);
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI + (i / 10) * Math.PI;
    const rr = f.r * (i % 2 ? 0.75 : 1);
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.closePath();
  c.fill();
  // Folha e cabo.
  c.fillStyle = GOLD;
  c.beginPath();
  c.ellipse(f.r * 0.5, f.r * 0.7, f.r * 0.45, f.r * 0.14, 0.6, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function build(key: string, width: number, bandH: number, seed: string): State {
  const rnd = createRandom(`${seed}:${width}`);
  const flowers: Flower[] = [];
  const step = Math.max(70, bandH * 0.9);
  for (let x = step * 0.5; x < width + step; x += step) {
    const big = rnd.next() < 0.6;
    flowers.push({
      x: x + rnd.range(-step * 0.15, step * 0.15),
      y: bandH * rnd.range(0.38, 0.62),
      r: bandH * (big ? rnd.range(0.2, 0.26) : rnd.range(0.12, 0.16)),
      kind: big ? 'rosa' : 'clavel',
      color: rnd.pick([IVORY, GOLD_LIGHT, CARMIM, IVORY]),
      rot: rnd.range(0, Math.PI * 2),
    });
  }
  const threads: Thread[] = [];
  for (let x = 1; x < width; x += 3) threads.push({ x, len: rnd.range(0.85, 1), phase: rnd.range(0, Math.PI * 2), sway: 0 });
  return { key, flowers, threads, lastScroll: typeof window === 'undefined' ? 0 : window.scrollY, wind: 0 };
}

export interface MantonProps {
  className?: string;
  seed?: string;
  /** Fração da altura ocupada pela seda bordada (o resto são os flecos). */
  band?: number;
}

export function Manton({ className, seed = 'manton', band = 0.42 }: MantonProps) {
  const stateRef = useRef<State | null>(null);

  const ref = useCanvas(
    (ctx, { width, height, time, dt, pointer, still }) => {
      const bandH = height * band;
      const key = `${width}x${height}`;
      let s = stateRef.current;
      if (!s || s.key !== key) {
        s = build(key, width, bandH, seed);
        stateRef.current = s;
      }
      ctx.clearRect(0, 0, width, height);

      // Vento: a velocidade do scroll empurra os flecos (e decai sozinho).
      if (!still) {
        const y = window.scrollY;
        const v = dt > 0 ? (y - s.lastScroll) / dt : 0;
        s.lastScroll = y;
        s.wind += (Math.max(-1, Math.min(1, v / 2500)) - s.wind) * Math.min(1, dt * 4);
      }

      // Seda: faixa vinho com franja de ouro embaixo e borda em ondas (o recorte do xale).
      ctx.fillStyle = SILK;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, bandH);
      const scallop = 22;
      for (let x = width; x >= 0; x -= scallop) ctx.quadraticCurveTo(x - scallop / 2, bandH + 9, x - scallop, bandH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.lineTo(width, 8);
      ctx.stroke();

      // Bordado: rosas e cravos ligados por um ramo dourado.
      ctx.strokeStyle = GOLD;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      s.flowers.forEach((f, i) => (i === 0 ? ctx.moveTo(f.x, f.y) : ctx.quadraticCurveTo((f.x + s!.flowers[i - 1]!.x) / 2, f.y + (i % 2 ? -18 : 18), f.x, f.y)));
      ctx.stroke();
      s.flowers.forEach((f) => (f.kind === 'rosa' ? rosa(ctx, f) : clavel(ctx, f)));

      // Flecos: cada fio é uma curva que pende da borda e balança.
      const fringeTop = bandH + 4;
      const fringeLen = height - fringeTop - 2;
      ctx.lineWidth = 1;
      for (const t of s.threads) {
        let target = Math.sin(time * 1.3 + t.phase) * 3 + s.wind * 38;
        if (pointer.active) {
          const dx = t.x - pointer.x;
          const near = Math.max(0, 1 - Math.abs(dx) / 90) * (pointer.y > fringeTop - 20 ? 1 : 0);
          target += Math.sign(dx || 1) * near * 22;
        }
        t.sway += (target - t.sway) * Math.min(1, dt * 6 || 1);
        const len = fringeLen * t.len;
        ctx.strokeStyle = t.phase > Math.PI ? GOLD : GOLD_LIGHT;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(t.x, fringeTop);
        ctx.quadraticCurveTo(t.x + t.sway * 0.2, fringeTop + len * 0.5, t.x + t.sway, fringeTop + len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    },
    { stillTime: 2, deps: [seed, band] },
  );

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none block h-full w-full', className)} />;
}
