import { describe, expect, it } from 'vitest';
import { profile } from '@/content/profile';
import { contentByLocale } from '@/lib/i18n/registry';
import { buildHead, buildJsonLd, localeFromPath, LOCALE_PATH } from './seo';

const types = (graph: { '@type': string | string[] }[]) => graph.flatMap((n) => n['@type']);

describe('SEO', () => {
  it('idioma vem da URL', () => {
    expect(localeFromPath('/')).toBe('pt-BR');
    expect(localeFromPath('/es/')).toBe('es');
    expect(localeFromPath('/es')).toBe('es');
    expect(localeFromPath('/escola')).toBe('pt-BR');
  });

  it('head tem canonical do próprio idioma, hreflang de todos e x-default', () => {
    const head = buildHead(contentByLocale.es, contentByLocale);
    expect(head).toContain(`<link rel="canonical" href="${profile.siteUrl}/es/" />`);
    expect(head).toContain(`hreflang="pt-BR" href="${profile.siteUrl}/"`);
    expect(head).toContain(`hreflang="es" href="${profile.siteUrl}/es/"`);
    expect(head).toContain('hreflang="x-default"');
    expect(head).toContain('<meta property="og:locale" content="es_ES" />');
    expect(head).toContain('application/ld+json');
  });

  it('títulos e descrições cabem no resultado do Google e citam Ribeirão Preto', () => {
    for (const c of Object.values(contentByLocale)) {
      expect(c.meta.title.length).toBeLessThanOrEqual(60);
      expect(c.meta.description.length).toBeLessThanOrEqual(160);
      expect(c.meta.title).toMatch(/Ribeirão Preto/);
      expect(c.meta.description).toMatch(/Ribeirão Preto/);
    }
  });

  it('dados estruturados: escola, aulas, festival e FAQ', () => {
    const { '@graph': graph } = buildJsonLd(contentByLocale['pt-BR']);
    expect(types(graph)).toEqual(expect.arrayContaining(['WebSite', 'WebPage', 'DanceSchool', 'DanceEvent', 'FAQPage']));
    const school = graph.find((n) => types([n]).includes('DanceSchool')) as Record<string, unknown> & {
      address: { addressLocality: string };
      hasOfferCatalog: { itemListElement: unknown[] };
    };
    expect(school.address.addressLocality).toBe('Ribeirão Preto');
    expect(school.hasOfferCatalog.itemListElement).toHaveLength(contentByLocale['pt-BR'].classes.items.length);
    const faq = graph.find((n) => types([n]).includes('FAQPage')) as { mainEntity: unknown[] };
    expect(faq.mainEntity).toHaveLength(contentByLocale['pt-BR'].faq.items.length);
    const event = graph.find((n) => types([n]).includes('DanceEvent')) as { startDate: string; offers: { url: string } };
    expect(event.startDate).toMatch(/^2026-11-21T18:00/);
    expect(event.offers.url).toContain('sympla.com.br');
  });

  it('cada idioma tem um caminho', () => {
    expect(Object.keys(LOCALE_PATH).sort()).toEqual(Object.keys(contentByLocale).sort());
  });
});
