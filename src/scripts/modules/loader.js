import { $, wait } from './utils.js';

const MIN_MS = 2400;   // desde el inicio de la navegación: la N termina de dibujarse
const MAX_MS = 4500;   // nunca bloquea la página más de esto (desde la navegación)
const STORAGE_KEY = 'netsolca-loader';

/**
 * Loader con la "N" de NETSOLCA:
 *  1. (CSS) La traza de la N se dibuja desde el nodo izquierdo, cada nodo
 *     late cuando la línea lo alcanza y aparece la N real.
 *  2. (Anime.js) Una barra muestra el progreso real de carga.
 *  3. (Anime.js) Al terminar de cargar, el panel sube como un telón con una
 *     franja cian detrás, y arranca la entrada del hero.
 * Solo se muestra en la primera visita de la sesión (lo decide el script
 * en línea del <head>, que también tiene un respaldo de 7 s).
 */
export function initLoader() {
  const html = document.documentElement;
  const el = $('[data-loader]');
  if (!el) return;
  if (!html.classList.contains('is-loading')) {
    el.remove();
    return;
  }

  const anime = window.anime;
  const panel = $('.loader__panel', el);
  const mark = $('.loader__mark', el);
  const bar = $('[data-loader-bar]', el);

  /* ---------- Progreso real: imágenes de la primera pantalla ---------- */
  const images = [...document.images].filter((img) => !el.contains(img) && img.loading !== 'lazy');
  let loaded = images.filter((img) => img.complete).length;
  const total = Math.max(1, images.length);
  const setProgress = (value) => {
    const p = Math.min(1, value);
    if (anime) anime({ targets: bar, scaleX: p, duration: 450, easing: 'easeOutQuad' });
    else bar.style.transform = `scaleX(${p})`;
  };
  setProgress(0.15 + (loaded / total) * 0.7);
  images.filter((img) => !img.complete).forEach((img) => {
    const done = () => { loaded += 1; setProgress(0.15 + (loaded / total) * 0.7); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

  // La entrada (dibujo de la N) es CSS: arranca sin esperar a este script.

  /* ---------- Salida ---------- */
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  const leave = async () => {
    setProgress(1);
    await wait(250);
    el.classList.add('is-leaving');
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* modo privado */ }

    if (anime) {
      const tl = anime.timeline({ easing: 'easeInOutQuart' });
      tl.add({ targets: mark, translateY: -18, opacity: 0, duration: 420, easing: 'easeInQuad' }, 0)
        .add({ targets: panel, translateY: '-100%', duration: 850 }, 260)
        .add({ targets: $('.loader__curtain', el), translateY: '-100%', duration: 850 }, 380);
      // El hero empieza a animarse justo cuando el telón empieza a subir
      setTimeout(() => html.classList.remove('is-loading'), 300);
      await tl.finished;
    } else {
      html.classList.remove('is-loading');
      el.classList.add('loader--fade');
      await wait(450);
    }
    el.remove();
  };

  // performance.now() cuenta desde el inicio de la navegación
  Promise.race([
    Promise.all([pageLoaded, wait(Math.max(0, MIN_MS - performance.now()))]),
    wait(Math.max(0, MAX_MS - performance.now())),
  ]).then(leave).catch(() => { html.classList.remove('is-loading'); el.remove(); });
}
