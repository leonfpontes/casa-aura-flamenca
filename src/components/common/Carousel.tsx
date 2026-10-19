import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: ReactNode;
  /** Nome acessível do carrossel (ex.: "Avaliações"). */
  label: string;
  /** Rótulos dos botões. */
  prevLabel: string;
  nextLabel: string;
  className?: string;
  /** Classes da faixa (gap, alinhamento). */
  trackClassName?: string;
}

/**
 * Carrossel de rolagem lateral de verdade: o visitante controla.
 * - setas ← → (passam ~uma tela);
 * - arrastar com o mouse, deslizar no trackpad (shift+roda) ou no dedo;
 * - teclado (←/→ com o carrossel em foco);
 * - encaixe em cada item e régua de progresso.
 * Todos os itens ficam alcançáveis — nada depende do scroll vertical da página.
 */
export function Carousel({ children, label, prevLabel, nextLabel, className, trackClassName }: CarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, progress: 0 });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const count = Children.count(children);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({ atStart: el.scrollLeft <= 4, atEnd: el.scrollLeft >= max - 4, progress: max > 0 ? el.scrollLeft / max : 1 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [update, count]);

  const go = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div className={cn('relative', className)}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carrossel"
        aria-label={label}
        tabIndex={0}
        onScroll={update}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') (e.preventDefault(), go(1));
          if (e.key === 'ArrowLeft') (e.preventDefault(), go(-1));
        }}
        // Arrastar com o mouse (no toque, a rolagem nativa já resolve).
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse' || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !ref.current) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) > 5) {
            d.moved = true;
            setDragging(true);
            ref.current.setPointerCapture(e.pointerId);
          }
          if (d.moved) ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (d?.moved) {
            setDragging(false);
            ref.current?.releasePointerCapture(e.pointerId);
          }
        }}
        onClickCapture={(e) => {
          // Um arraste não vira clique num link dentro do cartão.
          if (dragging) e.preventDefault();
        }}
        className={cn(
          'scroll-px-4 overflow-x-auto overscroll-x-contain outline-none sm:scroll-px-8 [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[var(--ouro)] [&::-webkit-scrollbar]:hidden',
          dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory lg:cursor-grab',
        )}
      >
        <div className={cn('flex w-max px-4 sm:px-8', trackClassName)}>{children}</div>
      </div>

      <div className="mt-6 flex items-center gap-4 px-4 sm:px-8">
        <span aria-hidden="true" className="h-px flex-1 bg-foreground/20">
          <span className="block h-full origin-left bg-[var(--ouro)] transition-transform duration-200" style={{ transform: `scaleX(${Math.max(0.06, state.progress)})` }} />
        </span>
        <div className="flex gap-2">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => go(dir)}
              disabled={dir === -1 ? state.atStart : state.atEnd}
              aria-label={dir === -1 ? prevLabel : nextLabel}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[var(--ouro)] text-lg transition-colors hover:bg-[var(--ouro)] hover:text-[var(--tinto)] disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
            >
              <span aria-hidden="true">{dir === -1 ? '←' : '→'}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
