/**
 * Utilidades compartidas entre módulos.
 */

/** @type {<T extends Element = HTMLElement>(selector: string, root?: ParentNode) => T | null} */
export const $ = (selector, root = document) => root.querySelector(selector);

/** @type {<T extends Element = HTMLElement>(selector: string, root?: ParentNode) => T[]} */
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Devuelve true si la persona pidió reducir el movimiento. */
export const prefersReducedMotion = () => reducedMotionQuery.matches;

/**
 * Espera un número de milisegundos.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/**
 * Limita un valor a un rango.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/* ---------- Ciclo de vida de la página (ClientRouter de Astro) ----------
 * Con la navegación sin recarga, el documento no se descarta al cambiar de
 * página: los listeners de window/document, los observers y los temporizadores
 * de la página anterior seguirían vivos. Cada página recibe una señal que se
 * cancela al salir de ella (main.js llama a startPage en cada astro:page-load).
 */
let pageController = new AbortController();

/** Cancela la página anterior y abre una nueva. La usa main.js. */
export function startPage() {
  pageController.abort();
  pageController = new AbortController();
}

/** Señal de la página actual, para `addEventListener(..., { signal })`. */
export const pageSignal = () => pageController.signal;

/**
 * Ejecuta `cleanup` al salir de la página actual.
 * @param {() => void} cleanup
 */
export const onPageLeave = (cleanup) => {
  pageController.signal.addEventListener('abort', cleanup, { once: true });
};
