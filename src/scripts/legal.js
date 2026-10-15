/**
 * Páginas legales: solo necesitan el año y el enlace de WhatsApp.
 */
import { config } from './config.js';
import { initYear } from './modules/media.js';
import { initWhatsApp } from './modules/whatsapp.js';

for (const init of [initYear, () => initWhatsApp(config.whatsapp)]) {
  try {
    init();
  } catch (error) {
    console.error('[netsolca] Error en página legal:', error);
  }
}
