import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Azulejo, CompasWheel, Halftone, Lunares } from './index';

describe('arte generativa', () => {
  it('Azulejo e Lunares renderizam canvas decorativos', () => {
    const { container } = render(
      <>
        <Azulejo seed="teste" size={40} className="absolute inset-0" />
        <Lunares />
      </>,
    );
    const canvases = container.querySelectorAll('canvas');
    expect(canvases).toHaveLength(2);
    canvases.forEach((c) => expect(c).toHaveAttribute('aria-hidden', 'true'));
  });

  it('Halftone expõe o texto alternativo via role="img"', () => {
    render(<Halftone src="/foto.jpg" alt="Bailaora no palco" />);
    expect(screen.getByRole('img', { name: 'Bailaora no palco' })).toBeInTheDocument();
  });

  it('CompasWheel desenha um número por tempo e destaca o atual', () => {
    const { container } = render(<CompasWheel beats={12} accents={[3, 6, 8, 10, 12]} current={2} />);
    const labels = [...container.querySelectorAll('text')].map((t) => t.textContent);
    expect(labels).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']);
    // Ponteiro presente quando há tempo soando.
    expect(container.querySelector('line')).not.toBeNull();
  });

  it('CompasWheel parado não mostra ponteiro', () => {
    const { container } = render(<CompasWheel beats={4} accents={[2, 3, 4]} />);
    expect(container.querySelector('line')).toBeNull();
  });
});

/** Contexto 2D falso: aceita qualquer chamada, para exercitar os desenhos sem canvas real. */
function fakeContext(): CanvasRenderingContext2D {
  const target: Record<string, unknown> = {};
  return new Proxy(target, {
    get: (obj, key) => (key in obj ? obj[key as string] : () => undefined),
    set: (obj, key, value) => {
      obj[key as string] = value;
      return true;
    },
  }) as unknown as CanvasRenderingContext2D;
}

describe('com contexto 2D simulado', () => {
  it('Azulejo e Lunares executam o quadro inicial', () => {
    const getContext = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(function (this: HTMLCanvasElement) {
        const ctx = fakeContext();
        (ctx as unknown as { canvas: HTMLCanvasElement }).canvas = this;
        return ctx as never;
      });
    const rect = vi
      .spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({ width: 800, height: 600, top: 0, left: 0, right: 800, bottom: 600, x: 0, y: 0, toJSON: () => ({}) });
    try {
      expect(() => render(<Azulejo seed="mock" />)).not.toThrow();
      expect(() => render(<Lunares />)).not.toThrow();
      expect(getContext).toHaveBeenCalled();
    } finally {
      getContext.mockRestore();
      rect.mockRestore();
    }
  });
});
