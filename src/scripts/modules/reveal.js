import { $$, onPageLeave, prefersReducedMotion } from './utils.js';

const STAGGER_MS = 80;
const MAX_STAGGER_STEPS = 6;
const REVEAL_MS = 700;

/**
 * Marca un elemento como visible y, al terminar la transición, retira
 * `data-reveal` para que el componente recupere sus propias transiciones.
 * Se conserva `.is-visible` porque algunos componentes lo usan (p. ej. el proceso).
 * @param {HTMLElement} el
 */
const reveal = (el) => {
  el.classList.add('is-visible');
  const delay = Number.parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0;
  setTimeout(() => {
    el.removeAttribute('data-reveal');
    el.style.removeProperty('--reveal-delay');
  }, REVEAL_MS + delay + 60);
};

/** Animaciones de entrada al hacer scroll (`[data-reveal]`). */
export function initReveal() {
  const items = $$('[data-reveal]');
  if (!items.length) return;

  // Escalonado para los hijos directos de [data-reveal-stagger]
  $$('[data-reveal-stagger]').forEach((group) => {
    $$(':scope > [data-reveal]', group).forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
    });
  });

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    items.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(/** @type {HTMLElement} */ (entry.target));
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  items.forEach((el) => observer.observe(el));
  onPageLeave(() => observer.disconnect());
}
