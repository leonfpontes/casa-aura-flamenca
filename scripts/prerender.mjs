/**
 * Pré-renderização: escreve uma página por idioma — dist/index.html (pt-BR) e
 * dist/es/index.html — com o HTML do React já pronto e as tags de SEO do idioma
 * no <head> (title, description, canonical, hreflang, Open Graph, schema.org).
 * Roda depois de `vite build` (cliente) e `vite build --ssr` (servidor).
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const marker = '<div id="root"></div>';
const seoBlock = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;

const { render, head, locales, LOCALE_PATH } = await import(`${root}dist-ssr/entry-server.js`);
const template = await readFile(`${root}dist/index.html`, 'utf8');
if (!template.includes(marker)) throw new Error(`Marcador ${marker} não encontrado em dist/index.html`);
if (!seoBlock.test(template)) throw new Error('Bloco <!--seo:start-->…<!--seo:end--> não encontrado em dist/index.html');

for (const locale of locales) {
  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${locale}">`)
    .replace(seoBlock, head(locale))
    .replace(marker, `<div id="root">${render(locale)}</div>`);
  const dir = `${root}dist${LOCALE_PATH[locale]}`;
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}index.html`, html);
  console.log(`prerender: ${locale} → dist${LOCALE_PATH[locale]}index.html (${(html.length / 1024).toFixed(1)} KiB)`);
}
await rm(`${root}dist-ssr`, { recursive: true, force: true });
