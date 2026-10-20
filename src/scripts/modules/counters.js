import { $$, onPageLeave, prefersReducedMotion } from './utils.js';

const DURATION_MS = 1500;
const formatter = new Intl.NumberFormat('es-VE');

/** Curva de desaceleración para el conteo. */
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

/**
 * Anima un número desde 0 hasta `data-count-to`.
 * @param {HTMLElement} el
 */
const animateCount = (el) => {
  const target = Number(el.dataset.countTo);
  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion()) {
    el.textContent = formatter.format(target);
    return;
  }

  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min(1, (now - start) / DURATION_MS);
    el.textContent = formatter.format(Math.round(target * easeOutCubic(progress)));
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/** Métricas animadas al entrar en pantalla (`[data-count-to]`). */
export function initCounters() {
  const counters = $$('[data-count-to]');
  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCount);
    return;
  }

  if (!prefersReducedMotion()) counters.forEach((el) => { el.textContent = '0'; });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animateCount(/** @type {HTMLElement} */ (entry.target));
    });
  }, { threshold: 0.6 });

  counters.forEach((el) => observer.observe(el));
  onPageLeave(() => observer.disconnect());
}
