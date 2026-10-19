import { Arrow } from '@/components/common/Arrow';
import { Container, SectionHeader } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Scene } from '@/components/motion/Scene';
import { Button } from '@/components/ui/button';
import { profile, stockImages } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';

/** Agenda: o próximo grande evento como cartaz; o resto como programa de temporada. */
export function Agenda() {
  const { agenda, ui } = useContent();
  const featured = agenda.items.find((e) => e.featured);
  const rest = agenda.items.filter((e) => e !== featured);

  return (
    <Scene id="agenda" label={agenda.eyebrow} tone="vinho">
      <Container>
        <SectionHeader id="agenda" heading={agenda} />

        {featured && (
          <Reveal className="grid overflow-hidden border border-foreground/30 lg:grid-cols-12">
            {featured.image && (
              <figure className="relative lg:col-span-12">
                <img
                  src={stockImages[featured.image]}
                  alt={featured.imageAlt ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[21/9] w-full object-cover max-sm:aspect-[4/3]"
                />
                <figcaption className="label-caps absolute right-3 bottom-3 bg-background/80 px-2 py-1 text-muted-foreground">{ui.stockPhoto}</figcaption>
              </figure>
            )}
            <div className="p-6 sm:p-10 lg:col-span-8">
              <p className="label-caps text-signal">{agenda.kindLabels[featured.kind]}</p>
              <h3 className="display mt-4 text-5xl text-balance sm:text-7xl">{featured.title}</h3>
              <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">{featured.description}</p>
            </div>
            <div className="flex flex-col justify-between gap-6 p-6 pt-0 sm:p-10 lg:col-span-4 lg:pl-0">
              <dl className="divide-y divide-foreground/20 border-y border-foreground/20">
                <div className="py-3">
                  <dt className="label-caps text-muted-foreground">{ui.when}</dt>
                  <dd className="mt-1 font-display text-2xl">{featured.when}</dd>
                </div>
                {featured.where && (
                  <div className="py-3">
                    <dt className="label-caps text-muted-foreground">{ui.where}</dt>
                    <dd className="mt-1">{featured.where}</dd>
                  </div>
                )}
              </dl>
              {featured.link && (
                <Button asChild variant="signal" size="lg" className="group h-14 text-base">
                  <TrackedLink href={featured.link.href} trackLabel="agenda_tickets">
                    {featured.link.label} <Arrow direction="up-right" />
                  </TrackedLink>
                </Button>
              )}
            </div>
          </Reveal>
        )}

        <ul className="mt-10 border-b border-foreground/20">
          {rest.map((e) => (
            <Reveal as="li" key={e.title} className="grid gap-2 border-t border-foreground/20 py-6 sm:grid-cols-12 sm:gap-6">
              <p className="label-caps text-muted-foreground sm:col-span-3">{e.when}</p>
              <h3 className="font-display text-3xl sm:col-span-4">{e.title}</h3>
              <p className="text-pretty text-muted-foreground sm:col-span-5">
                <span className="label-caps mr-2 text-signal">{agenda.kindLabels[e.kind]}</span>
                {e.description}
              </p>
            </Reveal>
          ))}
        </ul>

        <TrackedLink href={profile.instagram} trackEvent="outbound_click" trackLabel="agenda_instagram" className="group link-rule mt-8 inline-block font-display text-2xl">
          {agenda.instagramCta} {profile.instagramHandle} <Arrow direction="up-right" />
        </TrackedLink>
      </Container>
    </Scene>
  );
}
