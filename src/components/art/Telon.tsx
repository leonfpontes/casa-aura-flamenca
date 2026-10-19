import { cn } from '@/lib/utils';

/**
 * Telón — a cortina de veludo do teatro, em duas folhas.
 *
 * As folhas são só CSS: dobras do veludo em gradiente repetido, sombra na
 * borda que se abre e uma franja dourada embaixo. Quem as move é a cena
 * (GSAP), pelos atributos `data-telon-left` e `data-telon-right`, em
 * `xPercent`: 0 é fechado e ±100 é aberto.
 */
const velvet =
  'repeating-linear-gradient(90deg, #3a050c 0px, #5c0a15 22px, #6e0f1b 34px, #4a0710 52px, #2b0307 70px)';

function Leaf({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      data-telon-left={side === 'left' ? '' : undefined}
      data-telon-right={side === 'right' ? '' : undefined}
      className={cn('absolute inset-y-0 w-1/2 will-change-transform', side === 'left' ? 'left-0' : 'right-0')}
      style={{
        background: velvet,
        boxShadow: side === 'left' ? 'inset -40px 0 60px -20px rgb(0 0 0 / 0.65)' : 'inset 40px 0 60px -20px rgb(0 0 0 / 0.65)',
      }}
    >
      {/* Franja dourada na barra da cortina. */}
      <div
        className="absolute inset-x-0 bottom-0 h-6"
        style={{ background: 'repeating-linear-gradient(90deg, #e8b25e 0 2px, transparent 2px 5px)', maskImage: 'linear-gradient(transparent, black 30%)' }}
      />
      <div className="absolute inset-x-0 bottom-6 h-1 bg-[var(--ouro)]" />
    </div>
  );
}

export function Telon({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 z-20 overflow-hidden', className)}>
      <Leaf side="left" />
      <Leaf side="right" />
      {/* Bambalina: a sanefa franzida no alto do palco. */}
      <div
        className="absolute inset-x-0 top-0 h-10"
        style={{
          background: velvet,
          maskImage: 'radial-gradient(28px 22px at 50% 0, black 98%, transparent) 0 0 / 56px 100% repeat-x, linear-gradient(black, black) 0 0 / 100% 55% no-repeat',
        }}
      />
    </div>
  );
}
