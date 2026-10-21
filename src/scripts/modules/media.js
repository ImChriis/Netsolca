import { $$ } from './utils.js';

let listening = false;

/** Marca una imagen como lista (cargó o falló: nunca queda un hueco invisible). */
const markLoaded = (event) => {
  if (event.target instanceof HTMLImageElement) event.target.classList.add('is-loaded');
};

/**
 * Imágenes con `loading="lazy"`: aparecen con un fundido al cargar.
 *
 * Los eventos load/error se escuchan una sola vez en todo el documento (fase de
 * captura), así también se cubren las imágenes que se agregan después: las copias
 * del carrusel de clientes, las páginas que trae el ClientRouter o las fotos de
 * <picture> que cambian de tamaño. Si la imagen falla, se muestra igual.
 */
export function initLazyImages() {
  if (!listening) {
    listening = true;
    document.addEventListener('load', markLoaded, true);
    document.addEventListener('error', markLoaded, true);
  }
  // Las que ya terminaron antes de que existiera el listener
  $$('img[loading="lazy"]').forEach((img) => {
    if (img.complete) img.classList.add('is-loaded');
  });
  // A partir de aquí el CSS puede ocultar las que aún no cargan
  document.documentElement.classList.add('lazy-ready');
}

/** Año actual en el pie de página. */
export function initYear() {
  const year = String(new Date().getFullYear());
  $$('[data-year]').forEach((el) => { el.textContent = year; });
}
