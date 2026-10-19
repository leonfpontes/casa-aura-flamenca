import { useRef } from 'react';
import { BackgroundVideo } from '@/components/art/BackgroundVideo';
import { Lunares } from '@/components/art/Lunares';
import { Telon } from '@/components/art/Telon';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Container, Remate } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { CountUp } from '@/components/motion/CountUp';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile, stockVideos } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { useServices } from '@/lib/services';

/**
 * Abertura em três tempos, como uma noite de tablao:
 * 1. o telón se abre e revela o palco (vídeo tingido de vinho, lunares no compás);
 * 2. a logo é "desenhada" — as letras sobem e o traço dourado corre da bailarina até a ponta;
 * 3. ao rolar, a cena fica no palco (fixa) enquanto o vídeo se recolhe num arco
 *    andaluz e a logo sobe — só então o Ato I entra.
 */
export function Hero() {
  const { hero, contact: contactCopy } = useContent();
  const { contact } = useServices();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
        intro
          // O telón se abre: as folhas correm para os lados, com um leve atraso entre elas.
          .to('[data-telon-left]', { xPercent: -101, duration: 1.8, ease: 'power3.inOut' }, 0.15)
          .to('[data-telon-right]', { xPercent: 101, duration: 1.8, ease: 'power3.inOut' }, 0.22)
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06 }, 0.9)
          .from('[data-logo-centro]', { opacity: 0, y: -10, duration: 0.8 }, 1)
          .from('[data-logo-aura]', { opacity: 0, y: 24, duration: 1.1 }, 1.05)
          // O traço dourado é "desenhado" da esquerda (a bailarina) para a direita.
          .fromTo('[data-logo-ornament]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power2.inOut' }, 1.2)
          .from('[data-logo-artes]', { opacity: 0, x: 16, duration: 0.9 }, 1.9)
          .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 1.6);
      });
      // Sem movimento, o telón já começa aberto.
      mm.add({ moving: MEDIA.motion }, (ctx) => {
        if (!ctx.conditions?.moving) gsap.set('[data-telon-left], [data-telon-right]', { autoAlpha: 0 });
      });

      mm.add(MEDIA.desktop, () => {
        // A cena fica no palco por mais uma tela: o vídeo se recolhe num arco,
        // a logo sobe e encolhe, o texto sai — e só depois o Ato I sobe.
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, pin: true, start: 'top top', end: '+=110%', scrub: 0.6, anticipatePin: 1 },
        });
        tl.to('[data-hero-copy]', { opacity: 0, y: -60 }, 0)
          .to('[data-hero-strip]', { opacity: 0, y: 40 }, 0)
          .to('[data-hero-logo]', { scale: 0.5, yPercent: -30 }, 0)
          .fromTo(
            '[data-hero-stage]',
            { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' },
            { clipPath: 'inset(22% 35% 6% 35% round 999px 999px 0px 0px)' },
            0,
          )
          .to('[data-hero-video]', { scale: 1.25 }, 0)
          .to('[data-hero-arch]', { opacity: 1 }, 0.6);
      });
      mm.add(MEDIA.mobile, () => {
        // Celular: sem fixar (o hero é mais alto que a tela); o vídeo aproxima e a logo sobe.
        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-video]', { scale: 1.2, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-logo]', { yPercent: -20, opacity: 0.3, ease: 'none', scrollTrigger: exit });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="relative">
      <Scene
        id="inicio"
        label={hero.greeting}
        tone="vinho"
        customTransition
        className="min-h-svh pt-20 pb-0 lg:py-0 lg:pt-20"
        art={
          <>
            {/* O palco: vídeo de flamenco tingido de vinho. No scroll, ele se recolhe num arco. */}
            <div data-hero-stage className="absolute inset-0 overflow-hidden">
              <div data-hero-video className="absolute inset-0">
                <BackgroundVideo {...stockVideos.hero} label={hero.mediaAlt} className="object-[70%_center] opacity-85" />
              </div>
              <div className="absolute inset-0 bg-[var(--vinho)]/40 mix-blend-multiply" />
              {/* O vídeo-fonte é vertical: a metade esquerda (fundo desfocado) fica no escuro, a bailaora à direita. */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--vinho)]/90 via-[var(--vinho)]/60 via-45% to-transparent max-lg:hidden" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,var(--vinho)_88%)]" />
            </div>
            {/* Contorno dourado do arco, que aparece quando o palco termina de se recolher. */}
            <div
              data-hero-arch
              className="absolute top-[22%] right-[35%] bottom-[6%] left-[35%] hidden rounded-t-full border border-[var(--ouro)] opacity-0 lg:block"
            />
            <div className="absolute inset-0 text-foreground [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black_85%)]">
              <Lunares />
            </div>
          </>
        }
      >
        <Container className="flex min-h-[calc(100svh-5rem)] flex-col">
          <div className="label-caps flex flex-wrap items-center justify-between gap-3 pb-3 text-muted-foreground">
            <span data-hero-meta>{hero.greeting}</span>
            <span data-hero-meta className="hidden sm:inline">
              {profile.cities.join(' · ')}
            </span>
            <a data-hero-meta href="#aulas" className="flex items-center gap-2 text-foreground hover:text-signal">
              <span aria-hidden="true" className="size-2 rounded-full bg-signal" />
              {hero.badge}
            </a>
          </div>

          {/* Composição de cartel: tudo centrado, como no palco. */}
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <div data-hero-logo className="w-full max-w-[min(52rem,92vw)] origin-top">
              <Logo title={`${profile.venue} — ${profile.name}`} className="w-full" />
            </div>
            <div data-hero-copy className="mt-6 flex flex-col items-center">
              <div data-hero-fade>
                <Remate />
              </div>
              <SplitReveal as="h1" id="inicio-title" immediate className="display mt-5 max-w-3xl text-[clamp(2rem,4vw,3.5rem)] text-balance">
                {hero.title} <span className="highlight">{hero.titleHighlight}</span>
              </SplitReveal>
              <p data-hero-fade className="mt-4 max-w-2xl text-pretty text-foreground/80 sm:text-lg">
                {hero.description}
              </p>
              <div data-hero-fade className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
                <Button asChild variant="signal" size="lg" className="group h-12 rounded-full px-7 text-base">
                  <TrackedLink href="#aulas" trackLabel="hero_classes">
                    {hero.primaryCta} <Arrow />
                  </TrackedLink>
                </Button>
                <TrackedLink href={contact.whatsapp(contactCopy.whatsappMessage)} trackLabel="hero_whatsapp" className="link-rule text-base">
                  {hero.secondaryCta}
                </TrackedLink>
              </div>
            </div>
          </div>

          {/* Cartel de números: separados por estrelas douradas, não por fios. */}
          <div data-hero-strip>
            <dl data-hero-fade className="mb-6 flex flex-wrap items-end justify-center gap-x-6 gap-y-4 sm:gap-x-10">
              {hero.stats.map((stat, i) => (
                <div key={stat.label} className="flex items-end gap-6 sm:gap-10">
                  {i > 0 && (
                    <span aria-hidden="true" className="mb-4 hidden text-[var(--ouro)] sm:block">
                      ✦
                    </span>
                  )}
                  <div className="flex flex-col-reverse items-center gap-1">
                    <dt className="label-caps text-muted-foreground">{stat.label}</dt>
                    <dd className="font-display text-4xl leading-none text-signal sm:text-5xl">
                      <CountUp value={stat.value} />
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </Container>

        {/* As modalidades da casa correndo como a faixa de um cartaz de temporada. */}
        <div data-hero-strip className="overflow-hidden border-y border-[var(--ouro)]/40 py-3" aria-label={hero.disciplines.join(', ')}>
          <div className="flex w-max animate-[marquee_40s_linear_infinite]" aria-hidden="true">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0">
                {hero.disciplines.map((d) => (
                  <li key={d} className="flex items-center font-display text-xl whitespace-nowrap sm:text-2xl">
                    <span className="px-6">{d}</span>
                    <span className="text-[var(--ouro)]">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Scene>
      {/* O telón cobre a cena inteira (acima do conteúdo) até se abrir na entrada. */}
      <Telon className="z-30" />
    </div>
  );
}
