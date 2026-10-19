import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { BackgroundVideo } from '@/components/art/BackgroundVideo';
import { CompasWheel, useCompas } from '@/components/art/CompasWheel';
import { stockVideos } from '@/content/profile';
import { Container, SectionHeader } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { Scene } from '@/components/motion/Scene';
import { Button } from '@/components/ui/button';
import { useContent } from '@/lib/i18n/LocaleProvider';
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

  return (
    <Scene
      id="compas"
      label={compas.eyebrow}
      tone="noite"
      art={
        // A guitarra ao fundo, quase no escuro: o compás nasce do toque.
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5">
          <BackgroundVideo {...stockVideos.guitarra} className="opacity-25 grayscale-[40%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/20" />
        </div>
      }
    >
      <Container>
        <SectionHeader id="compas" heading={compas} />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div role="tablist" aria-label={compas.eyebrow} className="divide-y border-y">
              {compas.palos.map((p, i) => (
                <button
                  key={p.name}
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
              <div className="mx-auto aspect-square w-full max-w-xs">
                <CompasWheel beats={palo.beats} accents={palo.accents} current={current} />
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
