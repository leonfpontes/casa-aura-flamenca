import { describe, expect, it } from 'vitest';
import { contentByLocale } from '@/lib/i18n/registry';
import { es } from './locales/es';
import { ptBR } from './locales/pt-BR';
import { SECTION_ORDER, sectionNumber } from './sections';

/** Descreve a "forma" de um valor: chaves de objetos e tamanho de arrays, sem o texto. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, shape((value as Record<string, unknown>)[k])]),
    );
  }
  return typeof value;
}

/** Campos que não são texto traduzível e devem ser idênticos entre idiomas. */
const invariantKeys = new Set(['id', 'family', 'kind', 'href', 'featured', 'beats', 'bpm', 'instagram', 'name']);
function invariants(value: unknown, path = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => invariants(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      invariantKeys.has(k) && typeof v !== 'object' ? [`${path}.${k}=${String(v)}`] : invariants(v, `${path}.${k}`),
    );
  }
  return [];
}

describe('conteúdo do site', () => {
  it('pt-BR e es têm exatamente a mesma estrutura', () => {
    const { locale: _a, ...pt } = ptBR;
    const { locale: _b, ...spanish } = es;
    expect(shape(spanish)).toEqual(shape(pt));
  });

  it('ids, famílias, links, compás e nomes são iguais entre idiomas', () => {
    expect(invariants(es)).toEqual(invariants(ptBR));
  });

  it('acentos do compás ficam dentro do ciclo', () => {
    for (const content of Object.values(contentByLocale)) {
      for (const p of [...content.compas.palos, ...content.classes.items.map((c) => c.compas)]) {
        for (const a of p.accents) expect(a >= 1 && a <= p.beats).toBe(true);
      }
    }
  });

  it('todo item de navegação aponta para uma seção numerada', () => {
    for (const content of Object.values(contentByLocale)) {
      for (const item of content.nav.items) {
        expect(SECTION_ORDER).toContain(item.id);
      }
    }
  });

  it('numera seções com dois dígitos', () => {
    expect(sectionNumber('casa')).toBe('01');
    expect(sectionNumber('visite')).toBe(String(SECTION_ORDER.length).padStart(2, '0'));
    expect(sectionNumber('inicio')).toBe('');
  });
});
