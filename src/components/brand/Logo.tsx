import { cn } from '@/lib/utils';
import { LOGO_ARTES, LOGO_AURA, LOGO_CENTRO, LOGO_ORNAMENT, LOGO_VIEWBOX } from './logoPaths';

const SYMBOL_ID = 'aura-logo';
const GRADIENT_ID = 'aura-ouro';

/** Ouro da logo: claro no alto, âmbar embaixo — o brilho do traço original. */
function GoldGradient() {
  return (
    <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stopColor="var(--ouro-claro)" />
      <stop offset="0.55" stopColor="var(--ouro)" />
      <stop offset="1" stopColor="var(--ouro-escuro)" />
    </linearGradient>
  );
}

const PARTS = [
  { id: 'centro', d: LOGO_CENTRO },
  { id: 'aura', d: LOGO_AURA },
  { id: 'artes', d: LOGO_ARTES },
  { id: 'ornament', d: LOGO_ORNAMENT, gold: true },
] as const;

/**
 * Definição única da logo (os traçados pesam ~78 KB): uma `<symbol>` por parte,
 * renderizadas uma vez na página. Cada `<Logo>` só aponta para elas com `<use>`,
 * então o HTML não repete os traçados e o hero ainda anima parte por parte.
 */
export function LogoSprite() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        <GoldGradient />
        {PARTS.map((part) => (
          <symbol key={part.id} id={`${SYMBOL_ID}-${part.id}`} viewBox={LOGO_VIEWBOX}>
            <path d={part.d} fillRule="evenodd" fill={'gold' in part ? `url(#${GRADIENT_ID})` : undefined} />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Nome acessível. Sem ele, a logo é decorativa (aria-hidden). */
  title?: string;
}

/**
 * Logo da casa, fiel à arte original: letras na cor da tinta da cena
 * (`currentColor` — creme sobre vinho, vinho sobre creme) e o ornamento
 * (bailarina + traço) sempre em ouro.
 */
export function Logo({ className, title }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cn('block h-auto', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      {/* `data-logo-*` permite coreografar a entrada (hero): cada parte é um <use> próprio. */}
      {PARTS.map((part) => (
        <use key={part.id} {...{ [`data-logo-${part.id}`]: '' }} href={`#${SYMBOL_ID}-${part.id}`} width="100%" height="100%" />
      ))}
    </svg>
  );
}
