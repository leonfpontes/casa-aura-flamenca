import { useRef, useState } from 'react';
import { Abanico } from '@/components/art/Abanico';
import { Halftone } from '@/components/art/Halftone';
import { Album } from '@/components/common/Album';
import { Container, SectionHeader } from '@/components/common/Section';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/** A casa: história lida "acendendo", um painel de azulejos andaluzes e os pilares. */
export function House() {
  const { house, ui } = useContent();
  const [lead, ...rest] = house.story;
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-fact]', { opacity: 0, x: -24, stagger: 0.08, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '[data-facts]', start: 'top 85%' } });
        gsap.from('[data-pillar]', {
          yPercent: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '[data-pillars]', start: 'top 70%', toggleActions: 'play none none reverse' },
        });
        // O leque abre preso ao scroll (celular e desktop).
        gsap.fromTo('[data-house-fan]', { '--open': 0 }, { '--open': 1, ease: 'none', scrollTrigger: { trigger: '[data-pillars]', start: 'top 95%', end: 'top 45%', scrub: true } });
      });
      mm.add(MEDIA.desktop, () => {
        // O arco se abre conforme a leitura: começa estreito e alto, termina inteiro.
        gsap.fromTo(
          '[data-house-arch]',
          { clipPath: 'inset(6% 26% 0% 26% round 999px 999px 0 0)' },
          { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)', ease: 'none', scrollTrigger: { trigger: '[data-house-arch]', start: 'top 85%', end: 'center 45%', scrub: true } },
        );
        gsap.fromTo('[data-house-photo]', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-house-arch]', start: 'top bottom', end: 'bottom 40%', scrub: true } });
        gsap.from('[data-house-quote]', { xPercent: 30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '[data-house-arch]', start: 'center 80%', end: 'bottom 60%', scrub: true } });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="casa" label={house.eyebrow} tone="marfim">
      <Container>
        <div ref={ref}>
          <SectionHeader id="casa" heading={house} />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              {lead && (
                <SplitReveal mode="read" className="font-display text-2xl leading-snug text-pretty sm:text-4xl">
                  {lead}
                </SplitReveal>
              )}
              {/* No celular, a história completa fica atrás de "Ler mais" para encurtar a página. */}
              <div id="casa-mais" className={cn('mt-6 gap-6 text-muted-foreground sm:grid-cols-2 lg:mt-8 lg:grid', expanded ? 'grid' : 'hidden')}>
                {rest.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls="casa-mais"
                onClick={() => setExpanded((v) => !v)}
                className="link-rule mt-4 cursor-pointer text-sm lg:hidden"
              >
                {expanded ? ui.readLess : ui.readMore}
              </button>
              <dl data-facts className="mt-8 divide-y border-y lg:mt-10">
                {house.facts.map((fact) => (
                  <div key={fact.label} data-fact className="grid grid-cols-3 gap-4 py-3">
                    <dt className="label-caps pt-0.5 text-muted-foreground">{fact.label}</dt>
                    <dd className="col-span-2">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <figure className="lg:col-span-5">
              {/* A foto mora num arco andaluz, que se abre conforme a leitura avança. */}
              <div className="relative">
                <div data-house-arch className="relative aspect-[4/5] overflow-hidden rounded-t-full" style={{ clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)' }}>
                  {/* A foto chega em retícula de lunares e se funde no duotônico vinho sobre marfim. */}
                  <div data-house-photo className="absolute inset-0">
                    <Halftone src={stockImages.casaAlunas} alt={house.imageAlt} cell={8} className="absolute inset-0 text-foreground" />
                  </div>
                </div>
                {/* Moldura dupla dourada, como o arco de um pátio sevilhano. */}
                <div aria-hidden="true" className="pointer-events-none absolute -inset-3 rounded-t-full border border-[var(--ouro)]/70" />
                {/* Citação pousada sobre o arco, como uma placa no pátio. */}
                <blockquote data-house-quote className="tone-vinho relative -mt-20 ml-6 bg-background p-5 text-foreground shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)] lg:-ml-12">
                  <p className="font-display text-2xl leading-tight sm:text-3xl">“{house.quote.text}”</p>
                  <footer className="label-caps mt-3 text-muted-foreground">— {house.quote.author}</footer>
                </blockquote>
              </div>
              <figcaption className="label-caps mt-3 text-muted-foreground">{house.imageCredit}</figcaption>
            </figure>
          </div>

          {/* Pilares como as varetas de um leque: o abanico abre e cada pilar acende. */}
          <div data-pillars className="mt-16 lg:mt-24">
            <div data-house-fan className="mx-auto w-56 sm:w-72" style={{ ['--open' as string]: 1 }}>
              <Abanico />
            </div>
          </div>
          <ol className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {house.pillars.map((pillar, i) => (
              <li key={pillar.title} data-pillar className="border-t border-[var(--ouro)]/60 pt-4 text-center">
                <p className="font-display text-xl text-signal">{['I', 'II', 'III', 'IV'][i]}</p>
                <h3 className="mt-3 font-display text-2xl lg:mt-6 lg:text-3xl">{pillar.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
              </li>
            ))}
          </ol>

          {/* O álbum da casa: fotos reais publicadas pela Casa Aura. */}
          <Album title={house.gallery.title} credit={house.gallery.credit} items={house.gallery.items} />
        </div>
      </Container>
    </Scene>
  );
}
