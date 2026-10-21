/**
 * NETSOLCA · punto de entrada.
 * Cada módulo se inicia de forma aislada: si uno falla, el resto sigue funcionando.
 *
 * El sitio usa el ClientRouter de Astro (navegación sin recarga): este script
 * corre una sola vez, así que los módulos de página se vuelven a iniciar tras
 * cada navegación. El header es persistente y se inicia una sola vez.
 */
import { config } from './config.js';
import { initLoader } from './modules/loader.js';
import { initHeader } from './modules/header.js';
import { initHero } from './modules/hero.js';
import { initLazyImages, initYear } from './modules/media.js';
import { initReveal } from './modules/reveal.js';
import { initCounters } from './modules/counters.js';
import { initQuote } from './modules/quote.js';
import { initMarquees } from './modules/marquee.js';
import { initAccordions } from './modules/accordion.js';
import { initContactForm } from './modules/form.js';
import { initWhatsApp } from './modules/whatsapp.js';
import { initMap } from './modules/map.js';
import { initMotion } from './modules/motion.js';
import { startPage } from './modules/utils.js';

// Activa los estilos que dependen de JS (animaciones de entrada, fundidos)
document.documentElement.classList.add('js');

/** @type {Array<[name: string, init: () => void]>} */
const pageModules = [
  ['loader', () => initLoader()],
  ['hero', () => initHero()],
  ['media', () => initLazyImages()],
  ['year', () => initYear()],
  ['reveal', () => initReveal()],
  ['counters', () => initCounters()],
  ['quote', () => initQuote(config.whatsapp)],
  ['marquee', () => initMarquees()],
  ['accordion', () => initAccordions()],
  ['contact-form', () => initContactForm(config.whatsapp)],
  ['whatsapp', () => initWhatsApp(config.whatsapp)],
  ['map', () => initMap(config.map)],
  ['motion', () => initMotion()],
];

/** @param {Array<[name: string, init: () => void]>} modules */
const run = (modules) => {
  for (const [name, init] of modules) {
    try {
      init();
    } catch (error) {
      console.error(`[netsolca] No se pudo iniciar el módulo "${name}":`, error);
    }
  }
};

run([['header', () => initHeader()]]);
run(pageModules);

// Tras cada navegación del ClientRouter: se limpia la página anterior y se
// inician los módulos sobre el contenido nuevo.
let swapped = false;
document.addEventListener('astro:after-swap', () => {
  swapped = true;
  // El router copia los atributos de <html> de la página nueva: se recuperan las clases
  // (el listener de imágenes de media.js sigue activo, así que lazy-ready es seguro)
  document.documentElement.classList.add('js', 'lazy-ready');
});
document.addEventListener('astro:page-load', () => {
  if (!swapped) return; // la carga inicial ya se inició arriba
  swapped = false;
  startPage();
  run(pageModules);
});
