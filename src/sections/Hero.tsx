import { useRef } from 'react';
import { BackgroundVideo } from '@/components/art/BackgroundVideo';
import { Lunares } from '@/components/art/Lunares';
import { Telon } from '@/components/art/Telon';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/button';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { CountUp } from '@/components/motion/CountUp';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { profile, stockVideos } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { useServices } from '@/lib/services';

/**
 * Abertura, como uma noite de tablao:
 * 1. o telón se abre sobre o palco (vídeo tingido de vinho, lunares no compás);
 * 2. a logo é "desenhada" — as letras sobem e o traço dourado corre da bailarina até a ponta;
 * 3. ao rolar (desktop), a cena fica fixa: logo e texto se afastam para os lados
 *    como as folhas do telón, o palco escurece e a bailaora — inteira, no vídeo
 *    vertical — encolhe para dentro de um arco andaluz no centro. Só então o Ato I sobe.
 */
export function Hero() {
  const { hero, contact: contactCopy } = useContent();
  const { contact } = useServices();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to('[data-telon-left]', { xPercent: -101, duration: 1.8, ease: 'power3.inOut' }, 0.15)
          .to('[data-telon-right]', { xPercent: 101, duration: 1.8, ease: 'power3.inOut' }, 0.22)
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06 }, 0.9)
          .from('[data-logo-centro]', { opacity: 0, y: -10, duration: 0.8 }, 1)
          .from('[data-logo-aura]', { opacity: 0, y: 24, duration: 1.1 }, 1.05)
          // O traço dourado é "desenhado" da esquerda (a bailarina) para a direita.
          .fromTo('[data-logo-ornament]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power2.inOut' }, 1.2)
          .from('[data-logo-artes]', { opacity: 0, x: 16, duration: 0.9 }, 1.9)
          .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 1.5);
      });
      // Sem movimento, o telón já começa aberto.
      mm.add({ moving: MEDIA.motion }, (ctx) => {
        if (!ctx.conditions?.moving) gsap.set('[data-telon-left], [data-telon-right]', { autoAlpha: 0 });
      });

      mm.add(MEDIA.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: ref.current, pin: true, start: 'top top', end: '+=130%', scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
        });
        // Medidas do arco final: 76% da altura da tela, na proporção do vídeo (9:16).
        const archH = () => window.innerHeight * 0.76;
        const archW = () => (archH() * 9) / 16;
        tl.to('[data-hero-logo]', { xPercent: -40, opacity: 0, duration: 0.45 }, 0)
          .to('[data-hero-copy]', { xPercent: 40, opacity: 0, duration: 0.45 }, 0)
          .to('[data-hero-strip]', { y: 60, opacity: 0, duration: 0.35 }, 0)
          .to('[data-hero-meta]', { opacity: 0, duration: 0.3 }, 0)
          // O palco se fecha em volta da bailaora: a tela inteira vira um arco no centro.
          .fromTo(
            '[data-hero-window]',
            { width: () => window.innerWidth, height: () => window.innerHeight, marginBottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
            {
              width: archW,
              height: archH,
              marginBottom: () => window.innerHeight * 0.06,
              borderTopLeftRadius: () => archW() / 2,
              borderTopRightRadius: () => archW() / 2,
              duration: 1,
              ease: 'power1.inOut',
            },
            0.05,
          )
          .to('[data-hero-tint]', { opacity: 0.15, duration: 0.8 }, 0.15)
          .fromTo('[data-hero-frame]', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.25, stagger: 0.05 }, 0.85)
          .fromTo('[data-hero-window-caption]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2 }, 0.9);
      });
      mm.add(MEDIA.mobile, () => {
        // Celular: sem fixar (o hero é mais alto que a tela); o vídeo aproxima e a logo sobe.
        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-video]', { scale: 1.15, ease: 'none', scrollTrigger: exit });
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
        className="pt-20 pb-0 lg:h-svh lg:min-h-[40rem] lg:py-0 lg:pt-20"
        art={
          <>
            {/*
              O palco é um único vídeo (vertical, a bailaora centrada e de corpo inteiro).
              Começa cobrindo a tela; no scroll (desktop) o próprio palco se fecha num arco
              em volta dela — sem troca de vídeo, sem salto.
            */}
            <div className="absolute inset-0 flex items-end justify-center">
              <div data-hero-window className="relative h-full w-full overflow-hidden">
                <div data-hero-video className="absolute inset-0">
                  <BackgroundVideo {...stockVideos.heroVertical} label={hero.mediaAlt} className="object-[center_30%]" />
                </div>
                <div data-hero-tint className="absolute inset-0 bg-[var(--vinho)]/70" />
                <div data-hero-tint className="absolute inset-0 bg-gradient-to-r from-[var(--vinho)] via-transparent to-[var(--vinho)]/60 max-lg:hidden" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--vinho)]/80 to-transparent" />
                <p data-hero-window-caption className="label-caps absolute inset-x-0 bottom-6 text-center text-[var(--marfim)] opacity-0">
                  {hero.greeting}
                </p>
              </div>
            </div>
            {/* Moldura dupla dourada do arco final (aparece quando o palco termina de se fechar). */}
            <div className="pointer-events-none absolute inset-0 hidden items-end justify-center pb-[6svh] lg:flex">
              <div className="relative h-[76svh] w-[calc(76svh*9/16)]">
                <div data-hero-frame className="absolute -inset-3 rounded-t-full border border-[var(--ouro)] opacity-0" />
                <div data-hero-frame className="absolute -inset-6 rounded-t-full border border-[var(--ouro)]/40 opacity-0" />
              </div>
            </div>
            <div className="absolute inset-0 text-foreground [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_80%)]">
              <Lunares />
            </div>
          </>
        }
      >
        <Container>
          <div className="label-caps flex flex-wrap items-center justify-between gap-3 border-b border-foreground/25 pb-3 text-muted-foreground">
            <span data-hero-meta>{hero.greeting}</span>
            <span data-hero-meta className="hidden sm:inline">
              {profile.cities.join(' · ')}
            </span>
            <a data-hero-meta href="#aulas" className="flex items-center gap-2 text-foreground hover:text-signal">
              <span aria-hidden="true" className="size-2 rounded-full bg-signal" />
              {hero.badge}
            </a>
          </div>

          <div className="grid items-center gap-10 py-10 lg:grid-cols-12 lg:py-[min(3.5rem,4svh)]">
            <div data-hero-logo className="lg:col-span-7">
              <Logo title={`${profile.venue} — ${profile.name}`} className="w-full max-w-[min(48rem,95svh)]" />
            </div>
            <div data-hero-copy className="lg:col-span-5">
              <SplitReveal as="h1" id="inicio-title" immediate className="display text-[clamp(2.4rem,min(4.4vw,7.5svh),4.25rem)] text-balance">
                {hero.title} <span className="highlight">{hero.titleHighlight}</span>
              </SplitReveal>
              <p data-hero-fade className="mt-[min(1.5rem,2.5svh)] max-w-xl text-pretty text-foreground/80 sm:text-lg">
                {hero.description}
              </p>
              <div data-hero-fade className="mt-[min(2rem,3.5svh)] flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild variant="signal" size="lg" className="group h-12 px-7 text-base">
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

          <dl data-hero-strip data-hero-fade className="mb-[min(2rem,3svh)] grid grid-cols-2 border-t border-[var(--ouro)]/50 md:grid-cols-4">
            {hero.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse justify-end gap-1 border-b border-foreground/20 py-4 pr-4 md:border-b-0 ${i % 2 ? 'border-l border-foreground/20 pl-4' : ''} ${i > 0 ? 'md:border-l md:pl-5' : ''}`}
              >
                <dt className="label-caps text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-4xl leading-none text-signal sm:text-[clamp(2.5rem,6.5svh,3.75rem)]">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
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
