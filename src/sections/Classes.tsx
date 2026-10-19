import { useRef } from 'react';
import { CompasWheel, useCompas } from '@/components/art/CompasWheel';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene } from '@/components/motion/Scene';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSteppedScene, useStepTransition } from '@/hooks/useSteppedScene';
import { stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { useServices } from '@/lib/services';
import { cn } from '@/lib/utils';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Aulas em cena fixa: uma modalidade por passo de scroll. À esquerda, a roda
 * do compás conta em silêncio o ciclo da aula (12 tempos no flamenco,
 * 4 no cajón, 3 na dança cigana…) — o ritmo de cada sala, visto de relance.
 */
function ClassesStage() {
  const { classes, ui } = useContent();
  const { contact } = useServices();
  const ref = useRef<HTMLDivElement>(null);
  const count = classes.items.length;
  const { index, goTo } = useSteppedScene({ count, scopeRef: ref, stepLength: 40 });
  useStepTransition(ref, index);
  const current = classes.items[index] ?? classes.items[0]!;
  // A roda conta o compás da aula em silêncio enquanto está na tela.
  const reduced = useReducedMotion();
  const { ref: wheelRef, inView } = useInView<HTMLDivElement>();
  const beat = useCompas({ ...current.compas, bpm: 96, playing: inView && !reduced, sound: false });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.fromTo('[data-wheel]', { rotate: -20, opacity: 0.4 }, { rotate: 0, opacity: 1, duration: 1.2, ease: 'expo.out' });
        gsap.to('[data-odometer]', { yPercent: (-100 / count) * index, duration: 0.9, ease: 'expo.out' });
      });
    },
    { dependencies: [index, count], scope: ref },
  );

  return (
    <div ref={ref} className="grid items-center gap-10 lg:grid-cols-12">
      <div ref={wheelRef} aria-hidden="true" className="relative mx-auto hidden w-full max-w-md lg:col-span-5 lg:block">
        {/* Foto da aula (troca em fade) com a roda do compás pousada no canto, contando em silêncio. */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {classes.items.map((item, i) => (
            <img
              key={item.title}
              src={stockImages[item.image]}
              alt=""
              loading="lazy"
              decoding="async"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700',
                i === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0',
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tinto)]/70 via-transparent to-transparent" />
        </div>
        <div className="tone-vinho absolute -right-8 -bottom-8 size-48 rounded-full bg-background p-3 text-foreground shadow-[0_18px_40px_-12px_rgb(0_0_0/0.5)]">
          <div data-wheel className="absolute inset-3">
            <CompasWheel beats={current.compas.beats} accents={current.compas.accents} current={beat} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-[1em] overflow-hidden font-display text-3xl leading-none">
              <div data-odometer style={{ transform: `translateY(${(-100 / count) * index}%)` }}>
                {classes.items.map((_, i) => (
                  <div key={i} className="h-[1em]">
                    {pad(i + 1)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <HorizontalTrack media="mobile" label={classes.eyebrow} className="max-lg:flex max-lg:gap-5 lg:grid">
          {classes.items.map((item, i) => (
            <article
              key={item.title}
              data-step-item
              className={cn(
                'max-lg:w-[84vw] max-lg:shrink-0 max-lg:snap-center lg:[grid-area:1/1]',
                i === index ? 'lg:visible lg:opacity-100' : 'lg:invisible lg:opacity-0',
              )}
            >
              <img
                src={stockImages[item.image]}
                alt={item.imageAlt}
                loading="lazy"
                decoding="async"
                className="mb-5 aspect-[16/10] w-full object-cover lg:hidden"
              />
              <p className="label-caps flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-signal">{classes.familyLabels[item.family]}</span>
                <span>
                  {ui.audience}: {item.audience}
                </span>
              </p>
              <h3 className="display mt-4 text-4xl sm:text-6xl">{item.title}</h3>
              {item.teacher && (
                <p className="mt-3 font-display text-xl text-muted-foreground">
                  {ui.teacher} {item.teacher}
                </p>
              )}
              <p className="mt-5 max-w-xl text-lg text-pretty">{item.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {item.topics.map((t) => (
                  <li key={t} className="rounded-full border border-foreground/40 px-3 py-1.5 text-sm">
                    {t}
                  </li>
                ))}
              </ul>
              <TrackedLink
                href={contact.whatsapp(`${classes.whatsappPrefix} ${item.title.toLowerCase()}.`)}
                trackLabel={`class_${i}`}
                className="group link-rule mt-8 inline-block font-display text-2xl"
              >
                {classes.cta} <Arrow />
              </TrackedLink>
            </article>
          ))}
        </HorizontalTrack>
        <nav aria-label={classes.eyebrow} className="mt-12 hidden items-center gap-2 lg:flex">
          {classes.items.map((item, i) => (
            <button
              key={item.title}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === index ? 'step' : undefined}
              aria-label={item.title}
              className="group flex h-8 flex-1 cursor-pointer items-center"
            >
              <span className={cn('h-0.5 w-full transition-all duration-500', i === index ? 'bg-signal' : 'bg-foreground/25 group-hover:bg-foreground/60')} />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function Classes() {
  const { classes } = useContent();
  return (
    <Scene id="aulas" label={classes.eyebrow} tone="carmim" className="lg:py-16">
      <Container>
        <SectionHeader id="aulas" heading={classes} compact />
        <ClassesStage />
      </Container>
    </Scene>
  );
}
