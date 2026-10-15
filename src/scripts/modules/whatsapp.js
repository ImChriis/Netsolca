import { $$ } from './utils.js';

/**
 * Configura los enlaces `[data-whatsapp]` con el número de js/config.js.
 * Sin número, los enlaces conservan su destino de respaldo (#contacto).
 * @param {{ number?: string, message?: string }} [options]
 */
export function initWhatsApp({ number = '', message = '' } = {}) {
  const digits = String(number).replace(/\D/g, '');
  if (!digits) {
    console.info('[whatsapp] Define whatsapp.number en js/config.js. Mientras tanto, los botones llevan al formulario.');
    return;
  }

  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  const href = `https://wa.me/${digits}${query}`;

  $$('[data-whatsapp]').forEach((link) => {
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
}
