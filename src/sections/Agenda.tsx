import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, Remate, SectionHeader } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { Button } from '@/components/ui/button';
import { profile, stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

/**
 * Agenda — "do estúdio para o palco", literalmente: no desktop o festival em
 * destaque começa como uma foto pequena num arco e, presa ao scroll, cresce
 * até tomar a tela inteira (a cena fica fixa); então o cartel do festival sobe
 * por cima. O resto da temporada vem depois, como um programa impresso.
 * No celular, o arco já aparece aberto e o cartel vem logo abaixo.
 */
export function Agenda() {
  const { agenda, ui } = useContent();
  const featured = agenda.items.find((e) => e.featured);
  const rest = agenda.items.filter((e) => e !== featured);
  const stageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const mm = gsap.matchMedia();
      mm.add(MEDIA.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: stage, pin: true, start: 'top top', end: '+=150%', scrub: 0.6, anticipatePin: 1 },
        });
        tl.fromTo(
          '[data-poster-frame]',
          { clipPath: 'inset(18% 36% 8% 36% round 999px 999px 0px 0px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', duration: 1 },
        )
          // No arco inicial, a bailaora (a ~30% da foto) aparece no centro; depois a foto volta ao quadro inteiro.
          .fromTo('[data-poster-img]', { scale: 1.4, xPercent: 12, transformOrigin: '30% 60%' }, { scale: 1, xPercent: 0, duration: 1 }, 0)
          .to('[data-poster-arch]', { opacity: 0, duration: 0.3 }, 0.2)
          .fromTo('[data-poster-card]', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6 }, 0.85);
      });
    },
    { scope: stageRef },
  );

  return (
    <Scene id="agenda" label={agenda.eyebrow} tone="vinho" className="lg:min-h-0 lg:pb-24">
      <Container>
        <SectionHeader id="agenda" heading={agenda} />
      </Container>

      {featured && (
        <div ref={stageRef} className="relative lg:h-svh">
          {featured.image && (
            <figure className="relative mx-4 aspect-[4/5] sm:mx-8 sm:aspect-[16/9] lg:absolute lg:inset-0 lg:m-0 lg:aspect-auto">
              <div data-poster-frame className="absolute inset-0 overflow-hidden max-lg:rounded-t-full">
                <img
                  data-poster-img
                  src={stockImages[featured.image]}
                  alt={featured.imageAlt ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--tinto)]/85 via-[var(--tinto)]/20 to-transparent" />
              </div>
              <div
                data-poster-arch
                aria-hidden="true"
                className="absolute top-[18%] right-[36%] bottom-[8%] left-[36%] hidden rounded-t-full border border-[var(--ouro)] lg:block"
              />
              <figcaption className="label-caps absolute top-3 right-3 z-10 bg-background/80 px-2 py-1 text-muted-foreground lg:top-24 lg:right-8">
                {ui.stockPhoto}
              </figcaption>
            </figure>
          )}

          {/* O cartel do festival: sobe por cima da foto quando ela toma a tela. */}
          <Container className="relative lg:absolute lg:inset-x-0 lg:bottom-10">
            <div
              data-poster-card
              className="tone-noite relative mx-auto -mt-16 max-w-5xl border border-[var(--ouro)]/50 bg-background/90 p-6 text-center text-foreground backdrop-blur-sm sm:p-10 lg:mt-0"
            >
              <p className="label-caps text-signal">{agenda.kindLabels[featured.kind]}</p>
              <Remate className="my-4" />
              <h3 className="display text-5xl text-balance sm:text-7xl">{featured.title}</h3>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground lg:text-lg">{featured.description}</p>
              <dl className="mt-6 flex flex-wrap justify-center gap-x-10 gap-y-3">
                <div>
                  <dt className="label-caps text-muted-foreground">{ui.when}</dt>
                  <dd className="mt-1 font-display text-2xl">{featured.when}</dd>
                </div>
                {featured.where && (
                  <div>
                    <dt className="label-caps text-muted-foreground">{ui.where}</dt>
                    <dd className="mt-1 max-w-xs">{featured.where}</dd>
                  </div>
                )}
              </dl>
              {featured.link && (
                <Button asChild variant="signal" size="lg" className="group mt-7 h-13 rounded-full px-8 text-base">
                  <TrackedLink href={featured.link.href} trackLabel="agenda_tickets">
                    {featured.link.label} <Arrow direction="up-right" />
                  </TrackedLink>
                </Button>
              )}
            </div>
          </Container>
        </div>
      )}

      <Container>
        <ul className="mx-auto mt-16 max-w-4xl">
          {rest.map((e) => (
            <Reveal as="li" key={e.title} className="grid gap-2 border-t border-[var(--ouro)]/30 py-6 text-center sm:grid-cols-12 sm:gap-6 sm:text-left">
              <p className="label-caps text-[var(--ouro-claro)] sm:col-span-3">{e.when}</p>
              <h3 className="font-display text-3xl sm:col-span-4">{e.title}</h3>
              <p className="text-pretty text-muted-foreground sm:col-span-5">
                <span className="label-caps mr-2 text-signal">{agenda.kindLabels[e.kind]}</span>
                {e.description}
              </p>
            </Reveal>
          ))}
        </ul>

        <p className="mt-10 text-center">
          <TrackedLink href={profile.instagram} trackEvent="outbound_click" trackLabel="agenda_instagram" className="group link-rule font-display text-2xl">
            {agenda.instagramCta} {profile.instagramHandle} <Arrow direction="up-right" />
          </TrackedLink>
        </p>
      </Container>
    </Scene>
  );
}
