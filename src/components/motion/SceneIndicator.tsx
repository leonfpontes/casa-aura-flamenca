import { SECTION_ORDER, actNumeral } from '@/content/sections';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useSceneDirector } from '@/lib/motion/SceneDirector';
import { cn } from '@/lib/utils';

/**
 * Marcador de atos (telas ≥ 1536px, na margem livre): uma coluna de lunares,
 * um por ato. O ato em cena vira um lunar dourado maior, com "Ato III · Compás"
 * ao lado; os já vistos ficam cheios, os próximos só contornados. Clicável.
 */
export function SceneIndicator() {
  const { active } = useSceneDirector();
  const { ui, nav } = useContent();
  const current = active ? (SECTION_ORDER as readonly string[]).indexOf(active.chapter) : -1;
  const labelOf = (id: string) => nav.items.find((i) => i.id === id)?.label ?? id;

  return (
    <nav aria-label={ui.act} className="fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 2xl:block">
      <ol className="flex flex-col gap-3">
        {SECTION_ORDER.map((id, i) => (
          <li key={id}>
            <a href={`#${id}`} className="group flex items-center gap-3" aria-current={i === current ? 'step' : undefined}>
              <span
                className={cn(
                  'block rounded-full border transition-all duration-500',
                  i === current
                    ? 'size-3.5 border-[var(--ouro)] bg-[var(--ouro)]'
                    : i < current
                      ? 'size-2 border-foreground/70 bg-foreground/70'
                      : 'size-2 border-foreground/50 bg-transparent group-hover:bg-foreground/50',
                )}
              />
              <span
                className={cn(
                  'label-caps whitespace-nowrap transition-all duration-500',
                  i === current ? 'translate-x-0 text-foreground opacity-100' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-70',
                )}
              >
                {ui.act} {actNumeral(id)} · {labelOf(id)}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
