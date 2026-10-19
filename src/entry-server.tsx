import { renderToString } from 'react-dom/server';
import type { Locale } from './content/types';
import { contentByLocale } from './lib/i18n/registry';
import { createDefaultServices } from './lib/services';
import { buildHead, LOCALE_PATH } from './lib/seo/seo';
import { Root } from './Root';

/**
 * Pré-renderização (build): gera, para cada idioma, o HTML da página e as tags
 * de SEO do <head>, para que conteúdo e metadados apareçam antes do JavaScript.
 * Usado por scripts/prerender.mjs; no servidor o analytics é um NoopTracker.
 */
export function render(locale: Locale = 'pt-BR'): string {
  return renderToString(<Root services={createDefaultServices()} locale={locale} />);
}

export function head(locale: Locale = 'pt-BR'): string {
  return buildHead(contentByLocale[locale], contentByLocale);
}

export const locales = Object.keys(contentByLocale) as Locale[];
export { LOCALE_PATH };
