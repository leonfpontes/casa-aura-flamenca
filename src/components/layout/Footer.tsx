import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/common/Section';
import { TrackedLink } from '@/components/common/TrackedLink';
import { profile } from '@/content/profile';
import { useContent } from '@/lib/i18n/LocaleProvider';
import { useServices } from '@/lib/services';
import { MotionToggle } from './MotionControls';

export function Footer() {
  const { footer, nav, contact: copy } = useContent();
  const { contact } = useServices();
  const year = new Date().getFullYear();

  return (
    <footer className="tone-noite border-t border-foreground bg-background text-foreground">
      <Container className="grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="w-56" title={profile.venue} />
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">{footer.tagline}</p>
        </div>
        <nav aria-label="Rodapé" className="md:col-span-4">
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {nav.items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="space-y-2 text-sm md:col-span-3">
          <li>
            <TrackedLink href={contact.whatsapp(copy.whatsappMessage)} trackLabel="footer_whatsapp" className="link-rule">
              {contact.displayPhone()}
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={contact.email()} trackLabel="footer_email" className="link-rule">
              {profile.email}
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={profile.instagram} trackEvent="outbound_click" trackLabel="footer_instagram" className="link-rule">
              {profile.instagramHandle}
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={profile.instagramVenue} trackEvent="outbound_click" trackLabel="footer_instagram_venue" className="link-rule">
              @auradasartesribeiraopreto
            </TrackedLink>
          </li>
          <li>
            <TrackedLink href={profile.youtube} trackEvent="outbound_click" trackLabel="footer_youtube" className="link-rule">
              YouTube
            </TrackedLink>
          </li>
        </ul>
      </Container>
      <Container className="label-caps flex flex-col gap-2 border-t py-5 text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {year} {profile.name}. {footer.rights}
        </p>
        <MotionToggle />
        <p>{footer.credits}</p>
      </Container>
    </footer>
  );
}
