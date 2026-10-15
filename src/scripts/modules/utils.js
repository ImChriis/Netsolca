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
