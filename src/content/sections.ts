import type { SectionId } from './types';

/**
 * Ordem canônica das seções — os "atos" do site (Ato I, Ato II…).
 * Fonte única usada pela página (App) e pelos cabeçalhos de seção.
 * Funil: a casa → aulas → o compás (aprender) → quem ensina → agenda → dúvidas → visita.
 */
export const SECTION_ORDER = ['casa', 'aulas', 'compas', 'professores', 'depoimentos', 'agenda', 'faq', 'visite'] as const satisfies readonly SectionId[];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** Número do ato em algarismos romanos ("III"), como num programa de teatro; vazio se não numerado. */
export function actNumeral(id: SectionId): string {
  const index = (SECTION_ORDER as readonly SectionId[]).indexOf(id);
  return index < 0 ? '' : (ROMAN[index] ?? String(index + 1));
}

/** Número de seção com dois dígitos ("01"); string vazia se não numerada. */
export function sectionNumber(id: SectionId): string {
  const index = (SECTION_ORDER as readonly SectionId[]).indexOf(id);
  return index < 0 ? '' : String(index + 1).padStart(2, '0');
}
