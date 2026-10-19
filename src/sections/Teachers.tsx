import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import type { Teacher } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/** Iniciais para o monograma, enquanto a casa não envia o retrato. */
function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

/** Retrato num arco, como os camarins de um teatro antigo. Sem foto, o monograma sobre veludo. */
function Portrait({ t, lead }: { t: Teacher; lead: boolean }) {
  return (
    <div className="relative">
      <div data-portrait className="relative aspect-[3/4] overflow-hidden rounded-t-full">
        {t.photo ? (
          <img src={t.photo} alt={`${t.name} — ${t.role}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[center_3%]" />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'repeating-linear-gradient(90deg, #3a050c 0px, #5c0a15 14px, #4a0710 28px, #2b0307 40px)' }}
          >
            <span className={cn('font-display text-[var(--ouro-claro)]', lead ? 'text-7xl' : 'text-5xl')}>{initials(t.name)}</span>
          </div>
        )}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute -inset-1.5 rounded-t-full border border-[var(--ouro)]/70" />
    </div>
  );
}

/**
 * Professores como o elenco num programa de espetáculo: a diretora em
 * destaque, os demais numa galeria de arcos. Cada retrato se abre de baixo
 * para cima ao entrar (o arco "sobe" como uma cortina).
 */
export function Teachers() {
  const { teachers } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const [lead, ...rest] = teachers.items;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-teacher]', ref.current).forEach((el, i) => {
          gsap.from(el.querySelector('[data-portrait]'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.2,
            delay: (i % 4) * 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
          gsap.from(el, { y: 40, opacity: 0, duration: 1, delay: (i % 4) * 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="professores" label={teachers.eyebrow} tone="areia">
      <Container>
        <SectionHeader id="professores" heading={teachers} />
        <div ref={ref}>
          {lead && (
            <article data-teacher className="mx-auto grid max-w-4xl items-center gap-8 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-12">
              <figure>
                <Portrait t={lead} lead />
                {lead.photoCredit && <figcaption className="label-caps mt-3 text-center text-[0.6rem] text-muted-foreground">Foto: {lead.photoCredit}</figcaption>}
              </figure>
              <div className="text-center sm:text-left">
                <p className="label-caps text-signal">{lead.role}</p>
                <h3 className="display mt-3 text-5xl sm:text-6xl">{lead.name}</h3>
                <p className="mt-4 text-lg text-pretty text-muted-foreground">{lead.bio}</p>
                {lead.instagram && (
                  <TrackedLink
                    href={`https://www.instagram.com/${lead.instagram}/`}
                    trackEvent="outbound_click"
                    trackLabel={`teacher_${lead.instagram}`}
                    className="group link-rule mt-4 inline-block"
                  >
                    @{lead.instagram} <Arrow direction="up-right" />
                  </TrackedLink>
                )}
              </div>
            </article>
          )}
          <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {rest.map((t) => (
              <li key={t.name} data-teacher className="text-center">
                <Portrait t={t} lead={false} />
                <h3 className="mt-5 font-display text-2xl leading-tight">{t.name}</h3>
                <p className="label-caps mt-1 text-muted-foreground">{t.role}</p>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">{t.bio}</p>
                {t.instagram && (
                  <TrackedLink
                    href={`https://www.instagram.com/${t.instagram}/`}
                    trackEvent="outbound_click"
                    trackLabel={`teacher_${t.instagram}`}
                    className="group link-rule mt-2 inline-block text-sm"
                  >
                    @{t.instagram} <Arrow direction="up-right" />
                  </TrackedLink>
                )}
              </li>
            ))}
          </ul>
        </div>
        <p className="label-caps mt-12 text-center text-muted-foreground">{teachers.note}</p>
      </Container>
    </Scene>
  );
}
