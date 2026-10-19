// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { render } from './entry-server';

describe('pré-renderização', () => {
  it('gera o HTML da página sem depender do navegador', () => {
    const html = render();
    expect(html).toContain('no compás');
    expect(html).toContain('id="aulas"');
    expect(html).toContain('id="visite"');
    // Conteúdo de cenas mais abaixo também vem no HTML (SEO e leitura sem JS).
    expect(html).toContain('Carol Robatini');
    expect(html).toContain('Av. Nove de Julho');
  });
});
