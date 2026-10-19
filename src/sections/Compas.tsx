import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Abanico } from '@/components/art/Abanico';
import { BackgroundVideo } from '@/components/art/BackgroundVideo';
import { CompasWheel, useCompas } from '@/components/art/CompasWheel';
import { stockVideos } from '@/content/profile';
import { Container, SectionHeader } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { Scene } from '@/components/motion/Scene';
import { Button } from '@/components/ui/button';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';
import { cn } from '@/lib/utils';

/**
 * O compás — a parte "escola" do site: escolha um palo e ouça as palmas.
 * A roda conta o ciclo em tempo real, os acentos soam mais forte. Nada toca
 * sozinho: o som só começa com o clique (e respeita o volume do aparelho).
 */
export function Compas() {
  const { compas } = useContent();
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const palo = compas.palos[selected] ?? compas.palos[0]!;
  const current = useCompas({ beats: palo.beats, accents: palo.accents, bpm: palo.bpm, playing });
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        // O leque abre preso ao scroll enquanto a roda gira até o lugar; os palos entram em fila.
        const enter = { trigger: ref.current, start: 'top 85%', end: 'top 30%', scrub: true };
        gsap.fromTo('[data-compas-fan]', { '--open': 0, rotate: -40 }, { '--open': 1, rotate: 0, ease: 'none', scrollTrigger: enter });
        gsap.fromTo('[data-compas-wheel]', { rotate: -180, scale: 0.6 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: enter });
        gsap.from('[data-palo]', { x: -40, opacity: 0, stagger: 0.06, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 75%' } });
      });
    },
    { scope: ref },
  );

  return (
    <Scene
      id="compas"
      label={compas.eyebrow}
      tone="noite"
      art={
        // O tablao ao fundo, quase no escuro — bailaora, guitarra e cajón: o compás em cena.
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5">
          <BackgroundVideo {...stockVideos.tablao} className="opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/20" />
        </div>
      }
    >
      <Container>
        <SectionHeader id="compas" heading={compas} />
        <div ref={ref} className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div role="tablist" aria-label={compas.eyebrow} className="divide-y border-y">
              {compas.palos.map((p, i) => (
                <button
                  key={p.name}
                  data-palo
                  type="button"
                  role="tab"
                  aria-selected={i === selected}
                  aria-controls="compas-painel"
                  onClick={() => setSelected(i)}
                  className={cn(
                    'flex w-full cursor-pointer items-baseline justify-between gap-4 py-4 text-left transition-colors',
                    i === selected ? 'text-signal' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className="font-display text-3xl">{p.name}</span>
                  <span className="label-caps">
                    {p.beats} {compas.countLabel}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-6 text-sm text-pretty text-muted-foreground">{compas.intro}</p>
          </div>

          <Reveal className="lg:col-span-7">
            <div id="compas-painel" role="tabpanel" className="grid items-center gap-8 sm:grid-cols-2">
              <div className="relative mx-auto mt-24 aspect-square w-full max-w-xs sm:mt-16 lg:mt-0">
                {/* O leque abre por trás da roda — o pino do leque é o centro do relógio. */}
                <div data-compas-fan aria-hidden="true" className="absolute inset-x-[-30%] top-[-30%] opacity-60" style={{ ['--open' as string]: 1 }}>
                  <Abanico pleats={19} spread={200} />
                </div>
                <div data-compas-wheel className="relative size-full rounded-full bg-background/80 p-2">
                  <CompasWheel beats={palo.beats} accents={palo.accents} current={current} />
                </div>
              </div>
              <div>
                <p className="label-caps text-muted-foreground">
                  {palo.origin} · {palo.character}
                </p>
                <h3 className="display mt-3 text-5xl">{palo.name}</h3>
                <p className="mt-4 text-pretty">{palo.description}</p>
                <p className="label-caps mt-5">
                  {compas.accentsLabel}: <span className="text-signal">{palo.accents.join(' · ')}</span>
                </p>
                <Button
                  type="button"
                  variant="signal"
                  size="lg"
                  className="mt-6 h-12 gap-2 px-5"
                  aria-pressed={playing}
                  onClick={() => setPlaying((v) => !v)}
                >
                  {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
                  {playing ? compas.stop : compas.listen}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Scene>
  );
}
