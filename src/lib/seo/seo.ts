import { profile } from '@/content/profile';
import type { Locale, SiteContent } from '@/content/types';

/**
 * SEO gerado a partir do próprio conteúdo — o que o Google lê é sempre o que a
 * página mostra. Usado pela pré-renderização (scripts/prerender.mjs), que
 * escreve uma página por idioma (/ e /es/) com:
 * - <title>, description, canonical e Open Graph/Twitter do idioma;
 * - hreflang entre as versões (+ x-default);
 * - dados estruturados (schema.org): escola de dança, aulas, evento do
 *   festival, perguntas frequentes e o site.
 */

/** Caminho de cada idioma. O português é a raiz. */
export const LOCALE_PATH: Record<Locale, string> = { 'pt-BR': '/', es: '/es/' };

const OG_LOCALE: Record<Locale, string> = { 'pt-BR': 'pt_BR', es: 'es_ES' };

/** Idioma pelo caminho da URL ("/es/…" → es). */
export function localeFromPath(pathname: string): Locale {
  return /^\/es(\/|$)/.test(pathname) ? 'es' : 'pt-BR';
}

export function absoluteUrl(path: string): string {
  return new URL(path, profile.siteUrl).toString();
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Tags do <head> de um idioma (substituem o bloco <!--seo:start-->…<!--seo:end--> do index.html). */
export function buildHead(content: SiteContent, all: Record<Locale, SiteContent>): string {
  const locale = content.locale;
  const url = absoluteUrl(LOCALE_PATH[locale]);
  const image = absoluteUrl('/images/og-image.png');
  const { title, description } = content.meta;
  const alternates = (Object.keys(all) as Locale[])
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${absoluteUrl(LOCALE_PATH[l])}" />`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${absoluteUrl(LOCALE_PATH['pt-BR'])}" />`);
  const otherLocales = (Object.keys(all) as Locale[]).filter((l) => l !== locale);

  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:locale" content="${OG_LOCALE[locale]}" />`,
    ...otherLocales.map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}" />`),
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(content.meta.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify(buildJsonLd(content)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

/** Grafo schema.org da página de um idioma. */
export function buildJsonLd(content: SiteContent) {
  const locale = content.locale;
  const pageUrl = absoluteUrl(LOCALE_PATH[locale]);
  const schoolId = `${absoluteUrl('/')}#escola`;
  const address = {
    '@type': 'PostalAddress',
    streetAddress: `${profile.address.street.replace(' — ', ', ')}`,
    addressLocality: 'Ribeirão Preto',
    addressRegion: 'SP',
    postalCode: profile.address.zip,
    addressCountry: 'BR',
  };
  const [first, ...rest] = content.teachers.items;
  const featured = content.agenda.items.find((e) => e.featured);
  const f = profile.festival;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${absoluteUrl('/')}#site`,
        url: absoluteUrl('/'),
        name: profile.name,
        inLanguage: ['pt-BR', 'es'],
        publisher: { '@id': schoolId },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#pagina`,
        url: pageUrl,
        name: content.meta.title,
        description: content.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${absoluteUrl('/')}#site` },
        about: { '@id': schoolId },
        primaryImageOfPage: absoluteUrl('/images/og-image.png'),
      },
      {
        '@type': ['DanceSchool', 'LocalBusiness'],
        '@id': schoolId,
        name: profile.name,
        alternateName: [profile.venue, 'Casa Aura', 'Aura das Artes'],
        description: content.meta.description,
        url: absoluteUrl('/'),
        logo: absoluteUrl('/icons/icon-512.png'),
        image: [absoluteUrl('/images/og-image.png'), absoluteUrl('/images/bailaora-saia-giro.webp')],
        telephone: '+55-16-98247-0203',
        email: profile.email,
        foundingDate: String(profile.since),
        founder: { '@type': 'Person', name: profile.director, sameAs: first?.instagram ? `https://www.instagram.com/${first.instagram}/` : undefined },
        address,
        geo: { '@type': 'GeoCoordinates', ...profile.geo },
        hasMap: profile.mapUrl,
        areaServed: profile.cities.filter((c) => c !== 'On-line').map((c) => ({ '@type': 'City', name: c })),
        openingHoursSpecification: profile.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
          opens: h.opens,
          closes: h.closes,
        })),
        knowsAbout: content.compas.palos.map((p) => p.name).concat('Flamenco', 'Cajón', 'Baile flamenco'),
        sameAs: [profile.instagram, profile.instagramVenue, profile.youtube, profile.linktree],
        employee: [first, ...rest].filter(Boolean).map((t) => ({
          '@type': 'Person',
          name: t!.name,
          jobTitle: t!.role,
          ...(t!.instagram ? { sameAs: `https://www.instagram.com/${t!.instagram}/` } : {}),
        })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: content.classes.eyebrow,
          itemListElement: content.classes.items.map((c) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Course',
              name: c.title,
              description: c.description,
              inLanguage: 'pt-BR',
              provider: { '@id': schoolId },
              ...(c.teacher ? { instructor: { '@type': 'Person', name: c.teacher } } : {}),
            },
          })),
        },
      },
      ...(featured
        ? [
            {
              '@type': 'DanceEvent',
              '@id': `${absoluteUrl('/')}#festival`,
              name: f.name,
              description: featured.description,
              startDate: f.startDate,
              endDate: f.endDate,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              image: absoluteUrl('/images/tablao-palco-vermelho.webp'),
              location: {
                '@type': 'Place',
                name: f.venue,
                address: { '@type': 'PostalAddress', streetAddress: f.street, addressLocality: 'Ribeirão Preto', addressRegion: 'SP', addressCountry: 'BR' },
              },
              organizer: { '@id': schoolId },
              performer: f.performers.map((name) => ({ '@type': 'Person', name })),
              offers: { '@type': 'Offer', url: f.ticketsUrl, availability: 'https://schema.org/InStock', validFrom: '2026-09-01T00:00:00-03:00' },
            },
          ]
        : []),
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: locale,
        mainEntity: content.faq.items.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: { '@type': 'Answer', text: q.answer },
        })),
      },
    ],
  };
}
