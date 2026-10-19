import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { ContactLinkBuilder } from './lib/contact/ContactLinkBuilder';
import { LocaleProvider } from './lib/i18n/LocaleProvider';
import { ServicesProvider, type AppServices } from './lib/services';
import { ThemeProvider } from './lib/theme/ThemeProvider';

function renderApp() {
  const track = vi.fn();
  const services: AppServices = {
    analytics: { track },
    contact: new ContactLinkBuilder({ email: 'casa@example.com', whatsapp: '5516991091234' }),
  };
  render(
    <ServicesProvider value={services}>
      <ThemeProvider>
        <LocaleProvider initialLocale="pt-BR">
          <App />
        </LocaleProvider>
      </ThemeProvider>
    </ServicesProvider>,
  );
  return { track, user: userEvent.setup() };
}

describe('<App />', () => {
  beforeEach(() => localStorage.clear());

  it('renderiza o título principal e todas as seções numeradas', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/no compás/i);
    for (const id of ['casa', 'aulas', 'compas', 'professores', 'depoimentos', 'agenda', 'faq', 'visite']) {
      expect(document.getElementById(id)).toBeInTheDocument();
    }
  });

  it('cada aula tem CTA de aula experimental no WhatsApp com a modalidade na mensagem', () => {
    renderApp();
    const aulas = document.getElementById('aulas')!;
    const ctas = within(aulas).getAllByRole('link', { name: /agendar aula experimental/i });
    expect(ctas.length).toBeGreaterThan(3);
    expect(ctas[0]).toHaveAttribute('href', expect.stringMatching(/^https:\/\/wa\.me\/5516991091234\?text=.*inicia/));
    expect(ctas[0]).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('o festival em destaque leva aos ingressos', () => {
    renderApp();
    const agenda = document.getElementById('agenda')!;
    expect(within(agenda).getByRole('link', { name: /ingressos/i })).toHaveAttribute('href', expect.stringContaining('sympla.com.br'));
  });

  it('registra o clique de CTA no analytics', async () => {
    const { track, user } = renderApp();
    await user.click(screen.getAllByRole('link', { name: /conhecer as aulas/i })[0]!);
    expect(track).toHaveBeenCalledWith('cta_click', expect.objectContaining({ label: 'hero_classes' }));
  });

  it('troca o idioma para espanhol e persiste a escolha', async () => {
    const { user, track } = renderApp();
    await user.click(screen.getByRole('button', { name: 'ES' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/a compás/i);
    expect(document.documentElement.lang).toBe('es');
    expect(localStorage.getItem('aura:locale')).toBe('es');
    expect(track).toHaveBeenCalledWith('language_change', { label: 'es' });
  });

  it('troca o palo na seção de compás e mostra o play', async () => {
    const { user } = renderApp();
    const compas = document.getElementById('compas')!;
    await user.click(within(compas).getByRole('tab', { name: /bulerías/i }));
    expect(within(compas).getByRole('tab', { name: /bulerías/i })).toHaveAttribute('aria-selected', 'true');
    expect(within(compas).getByRole('heading', { level: 3, name: 'Bulerías' })).toBeInTheDocument();
    expect(within(compas).getByRole('button', { name: /ouvir as palmas/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('navega entre depoimentos', async () => {
    const { user } = renderApp();
    const section = document.getElementById('depoimentos')!;
    expect(within(section).getByText(/01 de 02/)).toBeInTheDocument();
    await user.click(within(section).getByRole('button', { name: /próximo/i }));
    expect(within(section).getByText(/02 de 02/)).toBeInTheDocument();
    await user.click(within(section).getByRole('button', { name: /próximo/i }));
    expect(within(section).getByText(/01 de 02/)).toBeInTheDocument();
  });

  it('alterna o tema escuro', async () => {
    const { user } = renderApp();
    const toggle = screen.getByRole('button', { name: /alternar tema/i });
    const wasDark = document.documentElement.classList.contains('dark');
    await user.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(!wasDark);
  });
});
