import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { profile } from '@/content/profile';
import type { Testimonial } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[80vw] shrink-0 flex-col justify-between rounded-t-[3rem] border border-foreground/25 bg-[color-mix(in_oklab,var(--background)_88%,white)] p-6 sm:w-[26rem] lg:p-8">
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
 * Vozes: um muro de avaliações em duas fileiras que correm em sentidos
 * opostos, presas ao scroll — como o público de um tablao, que vai passando.
 * Sem cena fixa: a seção tem a altura do próprio conteúdo. Sem movimento,
 * cada fileira vira um carrossel com rolagem lateral.
 */
export function Testimonials() {
  const { testimonials } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const half = Math.ceil(testimonials.items.length / 2);
  const rows = [testimonials.items.slice(0, half), testimonials.items.slice(half)];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        const scroll = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 };
        // Cada fileira percorre a própria sobra de largura: a de cima para a esquerda, a de baixo para a direita.
        gsap.utils.toArray<HTMLElement>('[data-voice-row]', ref.current).forEach((row, i) => {
          const travel = () => Math.max(0, row.scrollWidth - window.innerWidth);
          gsap.fromTo(
            row,
            { x: () => (i === 0 ? 0 : -travel()) },
            { x: () => (i === 0 ? -travel() : 0), ease: 'none', scrollTrigger: { ...scroll, invalidateOnRefresh: true } },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="depoimentos" label={testimonials.eyebrow} tone="ouro" className="lg:min-h-0">
      <Container>
        <SectionHeader id="depoimentos" heading={testimonials} />
      </Container>
      <div ref={ref} className="flex flex-col gap-6 overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={i}
            data-voice-row
            className="reduced:overflow-x-auto reduced:snap-x flex w-max gap-6 px-4 sm:px-8"
            style={{ marginLeft: i === 1 ? '6vw' : undefined }}
          >
            {row.map((t) => (
              <Card key={t.author} t={t} />
            ))}
          </div>
        ))}
      </div>
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
