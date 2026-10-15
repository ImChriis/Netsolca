/**
 * NETSOLCA · punto de entrada.
 * Cada módulo se inicia de forma aislada: si uno falla, el resto sigue funcionando.
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

// Activa los estilos que dependen de JS (animaciones de entrada, fundidos)
document.documentElement.classList.add('js');

/** @type {Array<[name: string, init: () => void]>} */
const modules = [
  ['loader', () => initLoader()],
  ['header', () => initHeader()],
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

for (const [name, init] of modules) {
  try {
    init();
  } catch (error) {
    console.error(`[netsolca] No se pudo iniciar el módulo "${name}":`, error);
  }
}
