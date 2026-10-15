// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * URL pública del sitio (canónicas, Open Graph, sitemap y robots.txt).
 * 1. SITE_URL (variable de entorno en Vercel) cuando tengas tu dominio.
 * 2. Si no, el dominio de producción que Vercel asigna automáticamente.
 * 3. Respaldo local. PLACEHOLDER: reemplazar por el dominio real.
 */
const SITE =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://www.netsolca.com');

/** Prioridad de cada página en el sitemap */
const PRIORITY = { '/': 1, '/servicios': 0.9, '/proyectos': 0.8, '/contacto': 0.8, '/nosotros': 0.7 };

export default defineConfig({
  site: SITE,
  // URLs limpias: /servicios (sin barra final ni .html), igual que en vercel.json
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        return {
          ...item,
          changefreq: path === '/' ? 'weekly' : 'monthly',
          priority: PRIORITY[path] ?? 0.3,
          lastmod: new Date().toISOString(),
        };
      },
    }),
  ],
});
