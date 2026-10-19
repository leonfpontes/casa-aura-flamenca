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
 * baixo (o scroll vira um passeio pelo pátio). Cada aula mora num arco
 * andaluz, com a roda do seu compás pousada no pé — 12 tempos no flamenco,
 * 4 no cajón, 3 na dança cigana. A foto desliza mais devagar que o cartão
 * (profundidade). No celular é o mesmo trilho, com encaixe a cada cartão.
 */
export function Classes() {
  const { classes, ui } = useContent();
  const { contact } = useServices();

  return (
    <Scene id="aulas" label={classes.eyebrow} tone="carmim" className="lg:py-16">
      <Container>
        <SectionHeader id="aulas" heading={classes} compact />
      </Container>
      <div className="pl-4 sm:pl-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        <HorizontalTrack label={classes.eyebrow} pace={0.9} className="flex gap-6 pr-[12vw] lg:gap-10">
          {classes.items.map((item, i) => (
            <article key={item.title} className="flex w-[80vw] shrink-0 snap-center flex-col sm:w-[46vw] lg:w-[min(30vw,26rem)]">
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-full">
                  <img
                    data-parallax
                    src={stockImages[item.image]}
                    alt={item.imageAlt}
                    style={{ objectPosition: stockImagePosition[item.image] }}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-y-0 -left-[8%] h-full w-[116%] max-w-none object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--tinto)]/70 via-transparent to-transparent" />
                  <p className="label-caps absolute inset-x-0 bottom-4 text-center text-[var(--marfim)]">{classes.familyLabels[item.family]}</p>
                </div>
                <div aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-t-full border border-[var(--ouro)]/70" />
                <div aria-hidden="true" className="tone-vinho absolute -right-3 -bottom-8 size-24 rounded-full bg-background p-1.5 text-foreground shadow-[0_14px_30px_-12px_rgb(0_0_0/0.6)]">
                  <CompasWheel beats={item.compas.beats} accents={item.compas.accents} />
                </div>
              </div>
              <div className="mt-10 flex flex-1 flex-col">
                <p className="font-display text-lg text-[var(--ouro-claro)]">{roman(i)}</p>
                <h3 className="display mt-1 text-3xl sm:text-4xl">{item.title}</h3>
                <p className="label-caps mt-3 text-foreground/75">
                  {ui.audience}: {item.audience}
                  {item.teacher && (
                    <>
                      {' '}
                      <span className="text-[var(--ouro)]">·</span> {ui.teacher} {item.teacher}
                    </>
                  )}
                </p>
                <p className="mt-4 text-pretty">{item.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.topics.map((t) => (
                    <li key={t} className="rounded-full border border-foreground/40 px-3 py-1 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
                <TrackedLink
                  href={contact.whatsapp(`${classes.whatsappPrefix} ${item.title.toLowerCase()}.`)}
                  trackLabel={`class_${i}`}
                  className="group link-rule mt-auto inline-block pt-6 font-display text-xl"
                >
                  {classes.cta} <Arrow />
                </TrackedLink>
              </div>
            </article>
          ))}
        </HorizontalTrack>
      </div>
    </Scene>
  );
}
