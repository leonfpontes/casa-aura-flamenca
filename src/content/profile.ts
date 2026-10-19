/**
 * Dados de identidade independentes de idioma (nome, canais, URLs).
 * Fonte única de verdade: alterar aqui reflete em todo o site e nos metadados.
 *
 * Fontes (out/2026): bio do Instagram, Linktree, ficha do Google Maps e
 * legendas dos posts da casa.
 */
export const profile = {
  name: 'Casa Aura Flamenca',
  /** A casa mora no Centro Cultural Aura das Artes (a logo do site). */
  venue: 'Aura das Artes — Centro Cultural',
  director: 'Carol Robatini',
  since: 2012,
  siteUrl: 'https://www.casaauraflamenca.com.br',
  email: 'casaauraflamenca@gmail.com',
  /** Apenas dígitos, com DDI — usado para montar links do WhatsApp. */
  whatsapp: '5516982470203',
  instagram: 'https://www.instagram.com/flamenco_ribeirao_preto/',
  instagramHandle: '@flamenco_ribeirao_preto',
  instagramVenue: 'https://www.instagram.com/auradasartesribeiraopreto/',
  youtube: 'https://www.youtube.com/@CasaAuraFlamenca',
  linktree: 'https://linktr.ee/CasaAuraFlamenca',
  address: {
    street: 'Av. Nove de Julho, 537 — sala 01',
    district: 'Jardim Sumaré',
    city: 'Ribeirão Preto — SP',
    zip: '14025-010',
  },
  mapUrl: 'https://www.google.com/maps/place/Casa+Aura+Flamenca/@-21.183884,-47.812548,17z',
  cities: ['Ribeirão Preto', 'Araraquara', 'On-line'],
} as const;

export type Profile = typeof profile;

/**
 * Banco de imagens e vídeos (Pexels, Unsplash e Pixabay — licenças livres, sem
 * atribuição obrigatória; créditos em public/images/CREDITS.md). São ilustrativos:
 * troque pelas fotos da casa quando a Carol enviar, mantendo os mesmos nomes.
 */
export const stockImages = {
  saiaGiro: '/images/bailaora-saia-giro.webp',
  palcoSaia: '/images/bailaora-palco-saia-800.webp',
  braceo: '/images/bailaora-braceo-800.webp',
  tablao: '/images/tablao-palco-vermelho.webp',
  sapatos: '/images/sapatos-flamenco-vermelhos-800.webp',
  castanholas: '/images/castanholas-maos-800.webp',
  guitarra: '/images/guitarra-flamenca-800.webp',
  aulaEstudio: '/images/aula-danca-estudio-800.webp',
  yoga: '/images/yoga-aula-800.webp',
  dancaDoVentre: '/images/danca-do-ventre-800.webp',
  cajon: '/images/cajon-percussao-800.webp',
  dancaCigana: '/images/danca-cigana-800.webp',
  stiletto: '/images/stiletto-salto-800.webp',
  pilates: '/images/pilates-800.webp',
  circulares: '/images/dancas-circulares-800.webp',
  aulaFlamenco: '/images/aula-flamenco-grupo-800.webp',
} as const;

/** Enquadramento das fotos que não são centradas (ex.: a dançarina embaixo do quadro). */
export const stockImagePosition: Partial<Record<keyof typeof stockImages, string>> = {
  stiletto: 'center 75%',
};

export type StockImage = keyof typeof stockImages;

export const stockVideos = {
  hero: {
    mp4: '/videos/hero-flamenco.mp4',
    webm: '/videos/hero-flamenco.webm',
    poster: '/videos/hero-flamenco-poster.webp',
    portrait: { mp4: '/videos/hero-flamenco-vertical.mp4', webm: '/videos/hero-flamenco-vertical.webm', poster: '/videos/hero-flamenco-vertical-poster.webp' },
  },
  tablao: { mp4: '/videos/tablao-flamenco.mp4', webm: '/videos/tablao-flamenco.webm', poster: '/videos/tablao-flamenco-poster.webp' },
  guitarra: { mp4: '/videos/guitarra-detalhe.mp4', webm: '/videos/guitarra-detalhe.webm', poster: '/videos/guitarra-detalhe-poster.webp' },
} as const;
