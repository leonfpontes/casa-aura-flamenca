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
  /**
   * URL pública do site — fonte única para canonical, Open Graph, hreflang,
   * sitemap e dados estruturados (o build injeta em todos). Ao ligar um
   * domínio próprio na Vercel, troque só aqui.
   */
  siteUrl: 'https://auradasartes.vercel.app',
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
  geo: { latitude: -21.183884, longitude: -47.812548 },
  /** Horário de funcionamento (Google Maps, out/2026), no formato do schema.org. */
  openingHours: [
    { days: ['Monday'], opens: '10:30', closes: '12:00' },
    { days: ['Monday', 'Tuesday'], opens: '17:00', closes: '21:30' },
    { days: ['Wednesday'], opens: '09:30', closes: '12:00' },
    { days: ['Wednesday'], opens: '18:00', closes: '21:00' },
    { days: ['Friday'], opens: '10:00', closes: '12:00' },
  ],
  /** Próximo festival — datas estruturadas para o Google (rich result de evento). */
  festival: {
    name: 'Flamenco Puro, Puro Flamenco — 8º Festival de Alunos Casa Aura Flamenca',
    startDate: '2026-11-21T18:00:00-03:00',
    endDate: '2026-11-22T22:00:00-03:00',
    venue: 'Teatro Arena Porão',
    street: 'R. 21 de Abril, 375',
    district: 'Vila Tibério',
    ticketsUrl: 'https://www.sympla.com.br/evento/flamenco-puro-puro-flamenco---mescla-em-essencia-e-compas/3618097',
    performers: ['Carol Robatini', 'Gustavo Rosa', 'Yuri Caires', 'Santy Torres', 'Jonas Rueda'],
  },
} as const;

export type Profile = typeof profile;

/**
 * Imagens do site. As de `/images/casa/` são fotos reais da Casa Aura (publicadas
 * pela própria casa no Google); as demais são de bancos livres (Pexels, Unsplash,
 * Pixabay — sem atribuição obrigatória). Créditos em public/images/CREDITS.md.
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
  // Fotos REAIS da casa (publicadas pela Casa Aura Flamenca no Google; créditos em CREDITS.md).
  casaAlunas: '/images/casa/casa-alunas.webp',
  iniciacao: '/images/casa/iniciacao-turma.webp',
  bailePerfil: '/images/casa/baile-perfil.webp',
  cajonSala: '/images/casa/cajon-sala.webp',
  festivalPalco: '/images/casa/festival-palco.webp',
  galeriaBraceo: '/images/casa/galeria-braceo.webp',
  galeriaCastanholas: '/images/casa/galeria-castanholas.webp',
  galeriaTurma: '/images/casa/galeria-turma.webp',
  galeriaRoda: '/images/casa/galeria-roda.webp',
  galeriaPalmas: '/images/casa/galeria-palmas.webp',
  galeriaArLivre: '/images/casa/galeria-ao-ar-livre.webp',
  galeriaEspetaculo: '/images/casa/galeria-espetaculo-800.webp',
  // Fotos do Instagram da casa (@flamenco_ribeirao_preto) — créditos dos fotógrafos no conteúdo e em CREDITS.md.
  castanholasRoda: '/images/casa/castanholas-roda.webp',
  bailManton: '/images/casa/baile-manton-branco.webp',
  cajonCantaor: '/images/casa/cajon-cantaor.webp',
  carolSolea: '/images/casa/carol-solea.webp',
  gMantonAsas: '/images/casa/galeria-manton-asas.webp',
  gLequeRosa: '/images/casa/galeria-leque-rosa.webp',
  gLequeAzul: '/images/casa/galeria-leque-azul.webp',
  gLanterna: '/images/casa/galeria-lanterna.webp',
  gFesta: '/images/casa/galeria-festa-da-casa.webp',
  gSevilhanas: '/images/casa/galeria-sevilhanas.webp',
  gMantones: '/images/casa/galeria-mantones.webp',
  gMantonBordado: '/images/casa/galeria-manton-bordado.webp',
  gSorriso: '/images/casa/galeria-sorriso.webp',
  gGuitarra: '/images/casa/galeria-guitarra.webp',
  gRosas: '/images/casa/galeria-rosas.webp',
  gFandangos: '/images/casa/galeria-fandangos.webp',
  gGiro: '/images/casa/galeria-giro.webp',
  gEnsaioPb: '/images/casa/galeria-ensaio-pb.webp',
} as const;

/**
 * Enquadramento (object-position) de cada foto nos arcos. O arco corta os cantos
 * de cima, então o rosto precisa ficar abaixo da cúpula e centrado: cada valor
 * foi calculado pela posição do rosto/corpo na foto e pela proporção do arco.
 */
export const stockImagePosition: Partial<Record<keyof typeof stockImages, string>> = {
  aulaFlamenco: 'center 55%',
  braceo: '45% 0%',
  cajon: 'center 18%',
  dancaDoVentre: '58% 24%',
  dancaCigana: 'center 0%',
  stiletto: '40% 50%',
  yoga: '68% center',
  pilates: '45% 35%',
  circulares: '55% 58%',
  iniciacao: 'center 35%',
  bailePerfil: '45% 30%',
  cajonSala: 'center 55%',
  casaAlunas: '40% 45%',
  castanholasRoda: 'center 45%',
  bailManton: 'center 25%',
  cajonCantaor: '30% 40%',
  carolSolea: 'center 20%',
  gLequeRosa: '60% center',
  tablao: 'center 40%',
};

export type StockImage = keyof typeof stockImages;

export const stockVideos = {
  hero: {
    mp4: '/videos/hero-flamenco.mp4',
    webm: '/videos/hero-flamenco.webm',
    poster: '/videos/hero-flamenco-poster.webp',
    portrait: { mp4: '/videos/hero-flamenco-vertical.mp4', webm: '/videos/hero-flamenco-vertical.webm', poster: '/videos/hero-flamenco-vertical-poster.webp' },
  },
  /** A bailaora inteira, em pé: o vídeo que pousa no arco do hero. */
  heroVertical: { mp4: '/videos/hero-flamenco-vertical.mp4', webm: '/videos/hero-flamenco-vertical.webm', poster: '/videos/hero-flamenco-vertical-poster.webp' },
  tablao: { mp4: '/videos/tablao-flamenco.mp4', webm: '/videos/tablao-flamenco.webm', poster: '/videos/tablao-flamenco-poster.webp' },
  guitarra: { mp4: '/videos/guitarra-detalhe.mp4', webm: '/videos/guitarra-detalhe.webm', poster: '/videos/guitarra-detalhe-poster.webp' },
} as const;
