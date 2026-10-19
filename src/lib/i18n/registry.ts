import { es } from '@/content/locales/es';
import { ptBR } from '@/content/locales/pt-BR';
import type { Locale, SiteContent } from '@/content/types';

/** Registro de idiomas (Open/Closed): adicionar um idioma = adicionar uma entrada. */
export const contentByLocale: Record<Locale, SiteContent> = {
  'pt-BR': ptBR,
  es,
};

export const DEFAULT_LOCALE: Locale = 'pt-BR';
export const SUPPORTED_LOCALES = Object.keys(contentByLocale) as Locale[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in contentByLocale;
}

/** Resolve o idioma inicial: preferência salva > idioma do navegador > padrão. */
export function resolveInitialLocale(saved: string | null, browserLanguages: readonly string[]): Locale {
  if (isLocale(saved)) return saved;
  // Navegador em espanhol (es, es-ES, es-AR…) e sem português na lista → espanhol.
  const langs = browserLanguages.map((l) => l.toLowerCase());
  if (langs.some((l) => l.startsWith('pt'))) return DEFAULT_LOCALE;
  return langs.some((l) => l.startsWith('es')) ? 'es' : DEFAULT_LOCALE;
}
