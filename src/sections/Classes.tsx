import { CompasWheel } from '@/components/art/CompasWheel';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { HorizontalTrack } from '@/components/motion/HorizontalTrack';
import { Scene } from '@/components/motion/Scene';
import { stockImagePosition, stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';

const roman = (n: number) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n] ?? String(n + 1);

/**
 * Aulas como uma galeria de arcos que corre para o lado enquanto se rola para
 * baixo (o scroll vira um passeio pelo pátio). O título da seção fica fixo
 * junto com a galeria, e cada cartão é medido pela ALTURA da tela — arco,
 * título, texto e convite cabem inteiros, sem cortes, do notebook ao celular.
 * Cada aula mora num arco andaluz, com a roda do seu compás pousada no pé.
 */
export function Classes() {
  const { classes, ui } = useContent();
  const { contact } = useServices();

  return (
    <Scene id="aulas" label={classes.eyebrow} tone="carmim" className="py-0 lg:min-h-0 lg:py-0">
      {/*
        Desktop: trilho horizontal fixo, guiado pelo scroll. Celular: carrossel
        nativo de deslizar com o dedo (encaixe em cada cartão) — sem fixar, o
        texto de cada aula aparece inteiro em qualquer altura de tela.
      */}
      <HorizontalTrack
        media="desktop"
        label={classes.eyebrow}
        pace={0.9}
        pinClassName="pt-8 pb-5 lg:pt-6"
        header={
          <Container>
            <SectionHeader id="aulas" heading={classes} compact />
            <p aria-hidden="true" className="label-caps -mt-4 mb-6 text-center text-foreground/70 lg:hidden">
              {ui.swipeHint} <span className="text-[var(--ouro)]">→</span>
            </p>
          </Container>
        }
        className="flex gap-5 pr-[12vw] pl-4 max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-pl-4 max-lg:overflow-x-auto max-lg:overscroll-x-contain max-lg:pt-3 max-lg:pb-6 max-lg:[scrollbar-width:none] sm:pl-8 lg:gap-10 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
      >
        {classes.items.map((item, i) => (
          <article key={item.title} className="flex w-[82vw] max-w-sm shrink-0 snap-start flex-col sm:w-[44vw] lg:w-[min(28vw,24rem)] lg:max-w-none">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full lg:aspect-auto lg:h-[min(38svh,26rem)]">
                <img
                  data-parallax
                  src={stockImages[item.image]}
                  alt={item.imageAlt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: stockImagePosition[item.image] ?? 'center 30%' }}
                  className="absolute inset-y-0 -left-[8%] h-full w-[116%] max-w-none object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--tinto)]/60 via-transparent via-40% to-transparent" />
                <p className="label-caps absolute inset-x-0 bottom-3 text-center text-[var(--marfim)]">{classes.familyLabels[item.family]}</p>
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-t-full border border-[var(--ouro)]/70" />
              <div aria-hidden="true" className="tone-vinho absolute -right-2 -bottom-5 size-[4.5rem] rounded-full bg-background p-1 text-foreground shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]">
                <CompasWheel beats={item.compas.beats} accents={item.compas.accents} />
              </div>
            </div>
            <div className="mt-6 flex flex-1 flex-col">
              <h3 className="display text-[clamp(1.6rem,3.6svh,2.25rem)] leading-tight">
                <span className="mr-2 font-display text-[0.6em] text-[var(--ouro-claro)]">{roman(i)}</span>
                {item.title}
              </h3>
              <p className="label-caps mt-2 text-foreground/75">
                {ui.audience}: {item.audience}
                {item.teacher && (
                  <>
                    {' '}
                    <span className="text-[var(--ouro)]">·</span> {ui.teacher} {item.teacher}
                  </>
                )}
              </p>
              <p className="mt-3 text-pretty lg:line-clamp-3 lg:[@media(max-height:760px)]:line-clamp-2">{item.description}</p>
              <TrackedLink
                href={contact.whatsapp(`${classes.whatsappPrefix} ${item.title.toLowerCase()}.`)}
                trackLabel={`class_${i}`}
                className="group link-rule mt-auto inline-block pt-4 font-display text-lg"
              >
                {classes.cta} <Arrow />
              </TrackedLink>
            </div>
          </article>
        ))}
      </HorizontalTrack>
    </Scene>
  );
}
