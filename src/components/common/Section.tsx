import type { ReactNode } from 'react';
import { actNumeral } from '@/content/sections';
import type { SectionHeading, SectionId } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { cn } from '@/lib/utils';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Reveal } from './Reveal';

/** Container horizontal padrão — único lugar que define largura e gutters. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-8', className)}>{children}</div>;
}

/**
 * Remate — o fio dourado com um cravo ao centro que separa as partes de um
 * programa de teatro espanhol (o "filete" de cartel de tablao).
 */
export function Remate({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn('flex items-center justify-center gap-3 text-[var(--ouro)]', className)}>
      <span className="h-px w-12 bg-current sm:w-20" />
      <svg viewBox="0 0 40 16" className="h-4 w-10" fill="currentColor">
        <path d="M20 1c2.2 2.4 2.2 4.6 0 7-2.2-2.4-2.2-4.6 0-7Z" />
        <path d="M20 8c3.4-1.6 6-1.4 8 .6-2.6 1.6-5.2 1.4-8-.6Zm0 0c-3.4-1.6-6-1.4-8 .6 2.6 1.6 5.2 1.4 8-.6Z" />
        <circle cx="5" cy="8" r="1.6" />
        <circle cx="35" cy="8" r="1.6" />
        <path d="M20 9.5v5" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="h-px w-12 bg-current sm:w-20" />
    </span>
  );
}

interface SectionHeaderProps {
  id: SectionId;
  heading: SectionHeading;
  /** Versão enxuta para cenas fixadas, que precisam caber numa única tela. */
  compact?: boolean;
  /** Alinhamento — o padrão é centrado, como a página de um programa de espetáculo. */
  align?: 'center' | 'start';
}

/**
 * Cabeçalho de ato: "Ato III · Compás", o remate dourado e o título centrado,
 * como no programa impresso de uma noite de tablao.
 */
export function SectionHeader({ id, heading, compact = false, align = 'center' }: SectionHeaderProps) {
  const { ui } = useContent();
  const centered = align === 'center';
  return (
    <Reveal className={cn('flex flex-col', centered ? 'items-center text-center' : 'items-start', compact ? 'mb-8 lg:mb-10' : 'mb-12 lg:mb-20')}>
      <p className="label-caps text-muted-foreground">
        {ui.act} {actNumeral(id)} <span className="px-1 text-[var(--ouro)]">·</span> {heading.eyebrow}
      </p>
      <Remate className={cn('my-4', !centered && 'justify-start')} />
      <SplitReveal
        as="h2"
        id={`${id}-title`}
        className={cn('display max-w-4xl text-balance', compact ? 'text-4xl sm:text-5xl' : 'text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl')}
      >
        {heading.title}
      </SplitReveal>
      {!compact && <p className={cn('mt-5 max-w-2xl text-pretty text-muted-foreground lg:text-lg', centered && 'mx-auto')}>{heading.description}</p>}
    </Reveal>
  );
}
