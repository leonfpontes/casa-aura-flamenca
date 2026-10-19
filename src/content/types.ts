/**
 * Modelo de domínio do conteúdo do site.
 *
 * Todo texto exibido vem de um objeto `SiteContent` (um por idioma).
 * Os componentes de seção dependem apenas destes tipos — nunca de strings
 * soltas — o que mantém a UI desacoplada do conteúdo (Dependency Inversion)
 * e garante, em tempo de compilação, que os idiomas tenham o mesmo formato.
 */

export type Locale = 'pt-BR' | 'es';

export type SectionId = 'inicio' | 'casa' | 'aulas' | 'compas' | 'professores' | 'depoimentos' | 'agenda' | 'faq' | 'visite';

export interface SectionHeading {
  eyebrow: string;
  title: string;
  description: string;
}

export interface Meta {
  /** <title> — até ~60 caracteres, com a busca principal ("aulas de flamenco em Ribeirão Preto"). */
  title: string;
  /** Meta description — ~150 caracteres, com cidade, diferenciais e chamada. */
  description: string;
  /** Texto alternativo da imagem de compartilhamento. */
  imageAlt: string;
}

export interface Navigation {
  items: { id: SectionId; label: string }[];
  cta: string;
  toggleTheme: string;
  toggleLanguage: string;
  openMenu: string;
  skipToContent: string;
}

export interface Hero {
  /** Linha curta acima do título (cidade, tipo de espaço). */
  greeting: string;
  /** Primeira linha do H1, com a busca local ("Escola de flamenco em Ribeirão Preto"). */
  kicker: string;
  /** Chamada no canto: leva direto às aulas. */
  badge: string;
  title: string;
  titleHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  /** As modalidades em uma linha, como num cartaz de temporada. */
  disciplines: string[];
  stats: { value: string; label: string }[];
  /** Texto alternativo do vídeo/foto de abertura. */
  mediaAlt: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

export interface Testimonials extends SectionHeading {
  items: Testimonial[];
  sourceNote: string;
}

export interface Pillar {
  title: string;
  description: string;
}

export interface House extends SectionHeading {
  story: string[];
  pillars: Pillar[];
  facts: { label: string; value: string }[];
  quote: { text: string; author: string };
  imageAlt: string;
  /** Legenda/crédito da foto da casa. */
  imageCredit: string;
  /** Álbum de fotos reais da casa. */
  gallery: { title: string; credit: string; items: { image: import('./profile').StockImage; alt: string; credit: string }[] };
}

/** Família da aula — define o tom da ficha e o filtro. */
export type ClassFamily = 'flamenco' | 'danca' | 'corpo';

export interface ClassItem {
  title: string;
  family: ClassFamily;
  /** Para quem é (nível, idade). */
  audience: string;
  description: string;
  /** O que se trabalha na aula. */
  topics: string[];
  /** Quem conduz, quando houver. */
  teacher?: string;
  /** Foto ilustrativa (chave de `stockImages`). */
  image: import('./profile').StockImage;
  imageAlt: string;
  /** Compás que a roda mostra enquanto esta aula está em cena. */
  compas: { beats: number; accents: number[] };
}

export interface Classes extends SectionHeading {
  familyLabels: Record<ClassFamily, string>;
  items: ClassItem[];
  cta: string;
  /** Mensagem pré-preenchida do WhatsApp ("Quero agendar uma aula experimental de…"). */
  whatsappPrefix: string;
}

export interface Palo {
  name: string;
  origin: string;
  character: string;
  description: string;
  beats: number;
  accents: number[];
  bpm: number;
}

export interface Compas extends SectionHeading {
  intro: string;
  listen: string;
  stop: string;
  countLabel: string;
  accentsLabel: string;
  palos: Palo[];
  videoAlt: string;
}

export interface Teacher {
  name: string;
  role: string;
  bio: string;
  /** Perfil do Instagram (sem @), quando houver. */
  instagram?: string;
  /**
   * Retrato (caminho em /public, ex.: '/images/professores/carol.webp').
   * Só com autorização da pessoa; sem foto, aparece o monograma.
   */
  photo?: string;
  /** Crédito do fotógrafo do retrato. */
  photoCredit?: string;
}

export interface Teachers extends SectionHeading {
  items: Teacher[];
  note: string;
}

export type EventKind = 'espetaculo' | 'tablao' | 'workshop' | 'curso';

export interface EventItem {
  title: string;
  kind: EventKind;
  description: string;
  /** Quando é (texto livre: "21 e 22 nov 2026", "Todo dezembro"). */
  when: string;
  where?: string;
  /** Foto ilustrativa (chave de `stockImages`). */
  image?: import('./profile').StockImage;
  imageAlt?: string;
  /** Crédito da foto (ex.: "Foto: Helyana Manso"). */
  imageCredit?: string;
  /** Ingressos ou mais informações. */
  link?: { label: string; href: string };
  /** Destaque da agenda (o próximo grande evento). */
  featured?: boolean;
}

export interface Agenda extends SectionHeading {
  kindLabels: Record<EventKind, string>;
  items: EventItem[];
  instagramCta: string;
}

export interface Faq extends SectionHeading {
  items: { question: string; answer: string }[];
}

export interface Contact extends SectionHeading {
  channels: {
    whatsapp: string;
    instagram: string;
    linktree: string;
    map: string;
  };
  whatsappMessage: string;
  addressLabel: string;
  hoursLabel: string;
  hours: string;
}

/** Rótulos de interface reutilizados por vários componentes. */
export interface MotionStrings {
  label: string;
  gentleNotice: string;
  enableFull: string;
  reduce: string;
  followSystem: string;
  dismiss: string;
}

export interface UiStrings {
  motion: MotionStrings;
  readMore: string;
  readLess: string;
  scrollHint: string;
  /** Dica de gesto nos carrosséis do celular. */
  swipeHint: string;
  previous: string;
  next: string;
  of: string;
  when: string;
  where: string;
  stockPhoto: string;
  /** "Ato" / "Acto" — cada seção é um ato do espetáculo. */
  act: string;
  audience: string;
  teacher: string;
}

export interface Footer {
  tagline: string;
  rights: string;
  credits: string;
}

export interface SiteContent {
  locale: Locale;
  meta: Meta;
  nav: Navigation;
  hero: Hero;
  house: House;
  classes: Classes;
  compas: Compas;
  teachers: Teachers;
  testimonials: Testimonials;
  agenda: Agenda;
  faq: Faq;
  contact: Contact;
  footer: Footer;
  ui: UiStrings;
}
