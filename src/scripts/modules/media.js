import { $$ } from './utils.js';

/**
 * Imágenes con `loading="lazy"`: aparecen con un fundido al cargar.
 * Si la imagen falla, se muestra igual para no dejar huecos invisibles.
 */
export function initLazyImages() {
  $$('img[loading="lazy"]').forEach((img) => {
    const done = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth > 0) {
      done();
      return;
    }
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}

/** Año actual en el pie de página. */
export function initYear() {
  const year = String(new Date().getFullYear());
  $$('[data-year]').forEach((el) => { el.textContent = year; });
}
