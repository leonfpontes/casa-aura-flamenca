import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // No build de pré-renderização (SSR) as dependências são externas: sem chunks manuais.
    rollupOptions: isSsrBuild
      ? {}
      : {
          output: {
            // Por pacote: React e animação em chunks próprios, com cache longo independente.
            manualChunks(id) {
              if (!id.includes('/node_modules/')) return undefined;
              if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
              if (/\/node_modules\/(gsap|@gsap|lenis)\//.test(id)) return 'motion';
              return undefined;
            },
          },
        },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
  },
}));
