// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { head, render } from './entry-server';

describe('pré-renderização', () => {
  it('gera o HTML em português sem depender do navegador', () => {
    const html = render('pt-BR');
    expect(html).toContain('Escola de flamenco em Ribeirão Preto');
    expect(html).toContain('id="aulas"');
    expect(html).toContain('id="visite"');
    expect(html).toContain('Carol Robatini');
  });

  it('gera a página em espanhol com o próprio head', () => {
    expect(render('es')).toContain('Escuela de flamenco en Ribeirão Preto');
    expect(head('es')).toContain('<title>Clases de Flamenco en Ribeirão Preto | Casa Aura Flamenca</title>');
  });
});
