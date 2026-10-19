import { Arrow } from '@/components/common/Arrow';
import { Carousel } from '@/components/common/Carousel';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { profile } from '@/content/profile';
import type { Testimonial } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[80vw] shrink-0 snap-start flex-col justify-between rounded-t-[3rem] border border-foreground/25 bg-[color-mix(in_oklab,var(--background)_88%,white)] p-6 sm:w-[26rem] lg:p-8">
      <div>
        <p aria-label="5 estrelas" className="tracking-[0.3em] text-signal">
          ★★★★★
        </p>
        <blockquote className="mt-4 font-display text-xl leading-snug text-pretty sm:text-2xl">“{t.quote}”</blockquote>
      </div>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-foreground/20 pt-4">
        <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-signal font-display text-signal-foreground">
          {t.author[0]}
        </span>
        <span>
          <span className="block font-medium">{t.author}</span>
          <span className="label-caps block text-muted-foreground">{t.context}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Vozes: as avaliações reais do Google num carrossel que o visitante percorre
 * de lado (setas, arrastar, deslizar ou teclado) — todas ficam alcançáveis.
 */
export function Testimonials() {
  const { testimonials, ui } = useContent();

  return (
    <Scene id="depoimentos" label={testimonials.eyebrow} tone="ouro" className="lg:min-h-0">
      <Container>
        <SectionHeader id="depoimentos" heading={testimonials} />
      </Container>
      <Carousel label={testimonials.eyebrow} prevLabel={ui.previous} nextLabel={ui.next} trackClassName="items-stretch gap-5 sm:gap-6">
        {testimonials.items.map((t) => (
          <Card key={t.author} t={t} />
        ))}
      </Carousel>
      <Container>
        <TrackedLink
          href={profile.mapUrl}
          trackEvent="outbound_click"
          trackLabel="testimonials_google"
          className="group label-caps link-rule mt-10 inline-block text-muted-foreground"
        >
          {testimonials.sourceNote} <Arrow direction="up-right" />
        </TrackedLink>
      </Container>
    </Scene>
  );
}
