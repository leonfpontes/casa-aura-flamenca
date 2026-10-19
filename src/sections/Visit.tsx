import { Azulejo } from '@/components/art/Azulejo';
import { Arrow } from '@/components/common/Arrow';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { Scene } from '@/components/motion/Scene';
import { SplitReveal } from '@/components/motion/SplitReveal';
import { Button } from '@/components/ui/button';
import { profile } from '@/content/profile';
import { sectionNumber } from '@/content/sections';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';

/** Encerramento: o convite sozinho no palco, com o endereço como num ingresso. */
export function Visit() {
  const { contact: copy } = useContent();
  const { contact } = useServices();
  const { address } = profile;

  return (
    <Scene
      id="visite"
      label={copy.eyebrow}
      tone="carmim"
      className="pb-36 lg:pb-40"
      art={
        <div className="absolute inset-x-0 bottom-0 h-20 lg:h-24">
          <Azulejo seed="visite" size={48} every={0.6} />
        </div>
      }
    >
      <Container>
        <p className="label-caps border-t border-foreground/40 pt-5 text-muted-foreground">
          § {sectionNumber('visite')} — {copy.eyebrow}
        </p>
        <div className="mt-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitReveal as="h2" id="visite-title" mode="chars" className="display text-6xl text-balance sm:text-8xl">
              {copy.title}
            </SplitReveal>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{copy.description}</p>
            <TrackedLink
              href={contact.whatsapp(copy.whatsappMessage)}
              trackLabel="visit_phone_big"
              className="mt-10 inline-block font-display text-4xl underline decoration-1 underline-offset-8 transition-colors hover:text-signal sm:text-6xl"
            >
              {contact.displayPhone()}
            </TrackedLink>
          </div>
          <div className="flex flex-col justify-end gap-8 lg:col-span-5">
            <Magnetic>
              <Button asChild variant="signal" size="lg" className="group h-16 w-full text-base">
                <TrackedLink href={contact.whatsapp(copy.whatsappMessage)} trackLabel="visit_whatsapp">
                  {copy.channels.whatsapp} <Arrow />
                </TrackedLink>
              </Button>
            </Magnetic>
            <dl className="divide-y divide-foreground/25 border-y border-foreground/25">
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="label-caps pt-1 text-muted-foreground">{copy.addressLabel}</dt>
                <dd className="col-span-2">
                  {address.street}
                  <br />
                  {address.district} · {address.city}
                  <br />
                  <TrackedLink href={profile.mapUrl} trackEvent="outbound_click" trackLabel="visit_map" className="group link-rule text-sm">
                    {copy.channels.map} <Arrow direction="up-right" />
                  </TrackedLink>
                </dd>
              </div>
              <div className="grid grid-cols-3 gap-4 py-3">
                <dt className="label-caps pt-1 text-muted-foreground">{copy.hoursLabel}</dt>
                <dd className="col-span-2 text-sm">{copy.hours}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-6 text-sm">
              <TrackedLink href={profile.instagram} trackEvent="outbound_click" trackLabel="visit_instagram" className="group underline underline-offset-4 hover:text-signal">
                {copy.channels.instagram} <Arrow direction="up-right" />
              </TrackedLink>
              <TrackedLink href={profile.youtube} trackEvent="outbound_click" trackLabel="visit_youtube" className="group underline underline-offset-4 hover:text-signal">
                YouTube <Arrow direction="up-right" />
              </TrackedLink>
              <TrackedLink href={contact.email()} trackLabel="visit_email" className="underline underline-offset-4 hover:text-signal">
                {profile.email}
              </TrackedLink>
            </div>
          </div>
        </div>
      </Container>
    </Scene>
  );
}
