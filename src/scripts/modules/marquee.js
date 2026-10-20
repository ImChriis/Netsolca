import { $$, pageSignal } from './utils.js';

/**
 * Marquee infinito: clona el grupo original (como `aria-hidden`) las veces
 * necesarias para cubrir la pantalla y ajusta la duración a la velocidad
 * deseada (`--marquee-speed`, en px por segundo).
 * @param {HTMLElement} marquee
 */
function setupMarquee(marquee) {
  const group = marquee.querySelector('.marquee__group');
  if (!(group instanceof HTMLElement)) return;
  const speed = Number.parseFloat(marquee.style.getPropertyValue('--marquee-speed')) || 40;

  const build = () => {
    marquee.querySelectorAll('[data-marquee-clone]').forEach((clone) => clone.remove());
    const gap = Number.parseFloat(getComputedStyle(marquee).columnGap) || 0;
    const width = group.getBoundingClientRect().width;
    if (!width) return;

    const copies = Math.max(1, Math.ceil(window.innerWidth / width));
    for (let i = 0; i < copies; i += 1) {
      const clone = /** @type {HTMLElement} */ (group.cloneNode(true));
      clone.setAttribute('aria-hidden', 'true');
      clone.dataset.marqueeClone = '';
      clone.querySelectorAll('img').forEach((img) => { img.alt = ''; });
      marquee.append(clone);
    }
    const shift = width + gap;
    marquee.style.setProperty('--marquee-shift', `${shift}px`);
    marquee.style.setProperty('--marquee-duration', `${(shift / speed).toFixed(2)}s`);
    marquee.dataset.ready = '';
  };

  build();
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    build();
  }, { passive: true, signal: pageSignal() });
  // Las imágenes diferidas cambian el ancho al cargar: se recalcula una vez
  group.querySelectorAll('img').forEach((img) => img.addEventListener('load', build, { once: true }));
}

/** Inicializa todos los `[data-marquee]`. */
export function initMarquees() {
  $$('[data-marquee]').forEach(setupMarquee);
}
