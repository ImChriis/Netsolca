import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { services } from '../data/services';
import { faq } from '../data/faq';

/**
 * llms.txt (https://llmstxt.org) generado en el build: resumen del sitio para
 * asistentes de IA (ChatGPT, Claude, Perplexity). Se arma con los mismos datos
 * de las páginas, así que se actualiza solo al editar servicios o preguntas.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://www.netsolca.com');
  const url = (path: string) => new URL(path, base).href;

  const pages = [
    { path: '/', name: 'Inicio', text: 'Qué hacemos, cotizador en línea y preguntas frecuentes' },
    { path: '/servicios', name: 'Servicios', text: 'Detalle de cada servicio: qué incluye y para quién es' },
    { path: '/proyectos', name: 'Proyectos', text: 'Sistemas, páginas y tiendas en línea desarrollados para empresas' },
    { path: '/nosotros', name: 'Nosotros', text: 'Historia, equipo, misión, visión y valores' },
    { path: '/contacto', name: 'Contacto', text: 'WhatsApp, teléfono, correo, redes y mapa de la oficina' },
  ];
  const legal = [
    { path: '/aviso-legal', name: 'Aviso legal' },
    { path: '/privacidad', name: 'Política de privacidad' },
    { path: '/terminos', name: 'Términos y condiciones' },
  ];

  const body = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} (RIF ${SITE.taxId}) es una empresa de desarrollo de software ubicada en ${SITE.address.locality}, estado ${SITE.address.region}, Venezuela. Atiende a empresas de todo el país las 24 horas, todos los días, por WhatsApp, teléfono, correo, videollamada o en persona.`,
    '',
    '## Páginas',
    '',
    ...pages.map((p) => `- [${p.name}](${url(p.path)}): ${p.text}`),
    '',
    '## Servicios',
    '',
    ...services.map((s) => `- [${s.title}: ${s.subtitle}](${url(`/servicios#${s.id}`)}): ${s.summary}`),
    '',
    '## Preguntas frecuentes',
    '',
    ...faq.map((item) => `- ${item.question} ${item.answer}`),
    '',
    '## Contacto',
    '',
    `- WhatsApp y teléfono: ${SITE.phone}`,
    `- Correo: ${SITE.email}`,
    `- Ubicación: ${SITE.address.locality}, ${SITE.address.region}, Venezuela`,
    ...SITE.social.map((s) => `- ${s.name}: ${s.url}`),
    '',
    '## Optional',
    '',
    ...legal.map((p) => `- [${p.name}](${url(p.path)})`),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
