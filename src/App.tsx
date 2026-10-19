import { Suspense, useEffect, type ComponentType } from 'react';
import { LogoSprite } from '@/components/brand/Logo';
import { Arrow } from '@/components/common/Arrow';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MotionNotice } from '@/components/layout/MotionControls';
import { SceneIndicator } from '@/components/motion/SceneIndicator';
import { SECTION_ORDER } from '@/content/sections';
import type { SectionId } from '@/content/types';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { ScrollTrigger } from '@/lib/motion/gsap';
import { useServices } from '@/lib/services';
import { Agenda } from '@/sections/Agenda';
import { Classes } from '@/sections/Classes';
import { Compas } from '@/sections/Compas';
import { Faq } from '@/sections/Faq';
import { Hero } from '@/sections/Hero';
import { House } from '@/sections/House';
import { Teachers } from '@/sections/Teachers';
import { Testimonials } from '@/sections/Testimonials';
import { Visit } from '@/sections/Visit';

/**
 * Registro seção → componente. A ordem vem de `SECTION_ORDER` (a mesma que
 * numera os capítulos), então reordenar a página é editar uma única lista.
 * Funil: a casa → aulas → compás → professores → vozes → agenda → dúvidas → visita.
 */
const sectionComponents: Record<(typeof SECTION_ORDER)[number], ComponentType> = {
  casa: House,
  aulas: Classes,
  compas: Compas,
  professores: Teachers,
  depoimentos: Testimonials,
  agenda: Agenda,
  faq: Faq,
  visite: Visit,
};

export function App() {
  const { contact: copy, hero } = useContent();
  const { contact } = useServices();

  // Depois que tudo montou, recalcula uma vez. Sem ScrollTrigger.sort(): a ordem
  // natural de criação (pins internos antes do gatilho da cena que os contém) é a correta.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <LogoSprite />
      <Header />
      <main id="conteudo" className="pb-12 sm:pb-0">
        <Hero />
        {SECTION_ORDER.map((id: SectionId) => {
          const Component = sectionComponents[id as (typeof SECTION_ORDER)[number]];
          // Cada seção é uma fronteira de hidratação: o React hidrata a primeira
          // tela antes e libera a CPU entre as demais (menos travamento no celular).
          return (
            <Suspense key={id} fallback={null}>
              <Component />
            </Suspense>
          );
        })}
      </main>
      <Footer />
      <SceneIndicator />
      <MotionNotice />

      {/* Barra de ação fixa apenas no mobile */}
      <TrackedLink
        href={contact.whatsapp(copy.whatsappMessage)}
        trackLabel="mobile_bar_whatsapp"
        className="group fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-foreground bg-signal px-4 py-3 text-signal-foreground sm:hidden"
      >
        <span className="label-caps truncate">{hero.badge}</span>
        <span className="shrink-0 text-sm font-medium whitespace-nowrap">
          WhatsApp <Arrow />
        </span>
      </TrackedLink>
    </>
  );
}
