import type { APIRoute } from 'astro';

/**
 * robots.txt generado en el build con la URL real del sitio (astro.config.mjs → site).
 * Permite indexar todo excepto la página 404 y apunta al sitemap.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://www.netsolca.com');
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /404',
    '',
    `Sitemap: ${new URL('/sitemap-index.xml', base).href}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
