import { useRef } from 'react';
import { BackgroundVideo } from '@/components/art/BackgroundVideo';
import { Lunares } from '@/components/art/Lunares';
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
 * Abertura: a cortina de veludo vinho (o fundo das artes da casa), a logo
 * "desenhada" — as letras sobem e o traço dourado corre da bailarina até a
 * ponta — e os lunares pulsando no compás de 12 tempos.
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
          .from('[data-hero-meta]', { opacity: 0, y: -12, duration: 0.6, stagger: 0.06 })
          .from('[data-logo-centro]', { opacity: 0, y: -10, duration: 0.8 }, 0.1)
          .from('[data-logo-aura]', { opacity: 0, y: 24, duration: 1.1 }, 0.15)
          // O traço dourado é "desenhado" da esquerda (a bailarina) para a direita.
          .fromTo('[data-logo-ornament]', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.6, ease: 'power2.inOut' }, 0.35)
          .from('[data-logo-artes]', { opacity: 0, x: 16, duration: 0.9 }, 1.1)
          .from('[data-hero-fade]', { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.6);
      });
      mm.add(MEDIA.desktop, () => {
        // Saída: a logo recua e a arte se dissolve enquanto a próxima cena sobe.
        const exit = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('[data-hero-logo]', { yPercent: -18, scale: 0.94, opacity: 0.2, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-video]', { yPercent: 12, scale: 1.08, ease: 'none', scrollTrigger: exit });
        gsap.to('[data-hero-hint]', { opacity: 0, ease: 'none', scrollTrigger: { ...exit, end: '15% top' } });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref}>
      <Scene
        id="inicio"
        label={hero.greeting}
        tone="vinho"
        customTransition
        className="pt-20 pb-0 lg:pb-0"
        art={
          <>
            {/* O palco: vídeo de bailaoras tingido de vinho, como a cortina de veludo das artes da casa. */}
            <div data-hero-video className="absolute inset-0">
              <BackgroundVideo {...stockVideos.hero} className="opacity-70 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--vinho)] via-[var(--vinho)]/35 to-[var(--vinho)]/85" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--vinho)] to-transparent" />
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

          <div className="grid items-center gap-10 py-10 lg:grid-cols-12 lg:py-16">
            <div data-hero-logo className="lg:col-span-7">
              <Logo title={`${profile.venue} — ${profile.name}`} className="w-full max-w-3xl" />
            </div>
            <div className="lg:col-span-5">
              <SplitReveal as="h1" id="inicio-title" immediate className="display text-[clamp(2.4rem,4.6vw,4.5rem)] text-balance">
                {hero.title} <span className="highlight">{hero.titleHighlight}</span>
              </SplitReveal>
              <p data-hero-fade className="mt-6 max-w-xl text-pretty text-muted-foreground sm:text-lg">
                {hero.description}
              </p>
              <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild variant="signal" size="lg" className="group h-12 px-6 text-base">
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

          <dl data-hero-fade className="mb-8 grid grid-cols-2 border-t border-foreground/40 md:grid-cols-4">
            {hero.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse justify-end gap-1 border-b border-foreground/25 py-4 pr-4 md:border-b-0 ${i % 2 ? 'border-l border-foreground/25 pl-4' : ''} ${i > 0 ? 'md:border-l md:pl-5' : ''}`}
              >
                <dt className="label-caps text-muted-foreground">{stat.label}</dt>
                <dd className="font-display text-4xl leading-none text-signal sm:text-6xl">
                  <CountUp value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Container>

        {/* As modalidades da casa correndo como a faixa de um cartaz de temporada. */}
        <div data-hero-fade className="overflow-hidden border-y border-foreground/25 py-4" aria-label={hero.disciplines.join(', ')}>
          <div className="flex w-max animate-[marquee_40s_linear_infinite]" aria-hidden="true">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0">
                {hero.disciplines.map((d) => (
                  <li key={d} className="flex items-center font-display text-2xl whitespace-nowrap sm:text-3xl">
                    <span className="px-6">{d}</span>
                    <span className="size-2 rounded-full bg-[var(--ouro)]" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Scene>
    </div>
  );
}
