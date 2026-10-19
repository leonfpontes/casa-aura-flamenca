import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, isLocale, resolveInitialLocale } from './registry';

describe('resolveInitialLocale', () => {
  it('prioriza a preferência salva', () => {
    expect(resolveInitialLocale('es', ['pt-BR'])).toBe('es');
  });

  it('ignora preferência salva inválida', () => {
    expect(resolveInitialLocale('fr', ['pt-BR'])).toBe('pt-BR');
  });

  it('usa espanhol para navegadores em espanhol', () => {
    expect(resolveInitialLocale(null, ['es-ES', 'es'])).toBe('es');
  });

  it('português vence quando aparece na lista', () => {
    expect(resolveInitialLocale(null, ['es-ES', 'pt-BR'])).toBe('pt-BR');
  });

  it('usa o padrão para idiomas não suportados ou lista vazia', () => {
    expect(resolveInitialLocale(null, ['de-DE'])).toBe(DEFAULT_LOCALE);
    expect(resolveInitialLocale(null, [])).toBe(DEFAULT_LOCALE);
  });

  it('valida códigos de idioma', () => {
    expect(isLocale('pt-BR')).toBe(true);
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(false);
  });
});
