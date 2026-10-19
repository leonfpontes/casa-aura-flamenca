import { useRef } from 'react';
import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { gsap, MEDIA, useGSAP } from '@/lib/motion/gsap';

/** Monograma no lugar da foto, enquanto a casa não envia os retratos. */
function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
}

/** Professores como a ficha técnica de um programa de espetáculo: linhas com fios, não cards. */
export function Teachers() {
  const { teachers } = useContent();
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MEDIA.motion, () => {
        gsap.from('[data-teacher]', {
          opacity: 0,
          y: 24,
          stagger: 0.07,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%' },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Scene id="professores" label={teachers.eyebrow} tone="areia">
      <Container>
        <SectionHeader id="professores" heading={teachers} />
        <ol ref={ref} className="border-b lg:ml-[25%]">
          {teachers.items.map((t, i) => (
            <li key={t.name} data-teacher className="grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-2 border-t py-6 sm:grid-cols-[auto_1fr_1.4fr] sm:gap-x-8">
              <span
                aria-hidden="true"
                className={`flex size-14 items-center justify-center rounded-full font-display text-xl ${i === 0 ? 'bg-signal text-signal-foreground' : 'border border-foreground/40'}`}
              >
                {initials(t.name)}
              </span>
              <div>
                <h3 className="font-display text-3xl leading-tight">{t.name}</h3>
                <p className="label-caps mt-1 text-muted-foreground">{t.role}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-pretty text-muted-foreground">{t.bio}</p>
                {t.instagram && (
                  <TrackedLink
                    href={`https://www.instagram.com/${t.instagram}/`}
                    trackEvent="outbound_click"
                    trackLabel={`teacher_${t.instagram}`}
                    className="group link-rule mt-2 inline-block text-sm"
                  >
                    @{t.instagram} <Arrow direction="up-right" />
                  </TrackedLink>
                )}
              </div>
            </li>
          ))}
        </ol>
        <p className="label-caps mt-6 text-muted-foreground lg:ml-[25%]">{teachers.note}</p>
      </Container>
    </Scene>
  );
}
