# Casa Aura Flamenca — site institucional

Site da **Casa Aura Flamenca** (direção de Carol Robatini), escola de flamenco desde 2012 que funciona no
**Centro Cultural Aura das Artes**, na Av. Nove de Julho, 537, em Ribeirão Preto/SP.

A base técnica e de design é a do site [perfil-portfolio](../perfil_portfolio): React 19, Vite, Tailwind 4, GSAP,
cenas com tons de cor, pré-renderização e testes. Diferenças em relação a ela:

- não tem login (a área `/entrar` do portfólio não existe aqui);
- a identidade é a da casa (veja [docs/DESIGN.md](docs/DESIGN.md)).

## Rodar

```bash
npm install
npm run dev        # http://localhost:3100
npm test           # testes (vitest)
npm run build      # build + pré-renderização em dist/
npm run preview    # serve o dist/ em http://localhost:4174
```

## Onde editar

| O quê | Arquivo |
|---|---|
| Textos (português e espanhol) | `src/content/locales/pt-BR.ts`, `src/content/locales/es.ts` |
| Telefone, e-mail, endereço, redes | `src/content/profile.ts` |
| Fotos e vídeos | `public/images`, `public/videos` (mapa em `profile.ts` → `stockImages` / `stockVideos`) |
| Ordem das seções | `src/content/sections.ts` |
| Cores e tipografia | `src/styles/globals.css` |
| Google Analytics | `GA_ID` em `index.html` (vazio = desligado) |

Os itens marcados com `// CONFIRMAR` em `pt-BR.ts` são informações que não puderam ser confirmadas nas fontes
públicas (Instagram, Linktree, Google Maps). A Carol precisa revisá-los.

## Mídia

As fotos e os vídeos são **ilustrativos**, de bancos gratuitos (Pexels, Unsplash, Pixabay), com licenças que permitem
uso comercial sem atribuição. Os créditos estão em [public/images/CREDITS.md](public/images/CREDITS.md). Para trocar
pelas fotos da casa, basta substituir os arquivos mantendo os mesmos nomes.

## Logo

A logo do Aura das Artes foi **vetorizada a partir da arte original**. A imagem foi ampliada 4×, a cor de cada ponto foi
decidida pela vizinhança (sem halo entre creme e ouro), a máscara passou por limpeza morfológica (sem furos) e as
curvas foram suavizadas no potrace. O resultado está em `src/components/brand/logoPaths.ts` e é desenhado pelo `Logo.tsx`:

- as letras usam `currentColor`, então ficam creme sobre vinho e vinho sobre creme;
- a bailarina e o traço usam um degradê de ouro.

Os traçados são definidos uma única vez, em `<symbol>`, pelo `LogoSprite`.

## Deploy

Pronto para a Vercel (`vercel.json`). O domínio `casaauraflamenca.com.br`, usado nos metadados (`index.html`,
`profile.ts`, `sitemap.xml`, `robots.txt`), é uma **suposição**: ajuste quando o domínio for definido.
