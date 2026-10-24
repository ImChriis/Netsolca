import type { APIRoute } from 'astro';

/**
 * robots.txt generado en el build con la URL real del sitio (astro.config.mjs → site).
 * Permite rastrear todo y apunta al sitemap. La 404 no se bloquea aquí: si se
 * bloqueara, Google no podría leer su meta noindex.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://www.netsolca.com');
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('/sitemap-index.xml', base).href}`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
