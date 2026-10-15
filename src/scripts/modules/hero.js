import { $, clamp, prefersReducedMotion } from './utils.js';

const EASE = 0.08;       // suavizado del parallax (lerp)
const SETTLE = 0.001;    // umbral para detener el bucle de animación

/**
 * Parallax del visual del hero: sigue al puntero (solo con mouse)
 * y se desplaza levemente con el scroll. Cada capa define su `--depth`.
 */
export function initHero() {
  const visual = $('[data-hero-visual]');
  if (!visual) return;

  if (prefersReducedMotion()) return;

  const hero = visual.closest('.hero');
  if (!(hero instanceof HTMLElement)) return;

  let target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let raf = 0;
  let inView = true;

  const loop = () => {
    current.x += (target.x - current.x) * EASE;
    current.y += (target.y - current.y) * EASE;
    visual.style.setProperty('--px', current.x.toFixed(4));
    visual.style.setProperty('--py', current.y.toFixed(4));

    const moving = Math.abs(target.x - current.x) > SETTLE || Math.abs(target.y - current.y) > SETTLE;
    raf = moving ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      target = {
        x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
        y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
      };
      kick();
    });
    hero.addEventListener('pointerleave', () => {
      target = { x: 0, y: 0 };
      kick();
    });
  }

  // Parallax de scroll: solo mientras el hero está en pantalla
  let scrollTicking = false;
  const onScroll = () => {
    if (!inView || scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      visual.style.setProperty('--sy', Math.min(window.scrollY, hero.offsetHeight).toFixed(1));
      scrollTicking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }).observe(hero);
  }
}
