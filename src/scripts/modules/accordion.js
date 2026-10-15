import { $$ } from './utils.js';

/**
 * Acordeón accesible. Usa `data-accordion="single"` para permitir
 * solo un panel abierto a la vez. Los paneles cerrados quedan `inert`.
 * @param {HTMLElement} root
 */
export function createAccordion(root) {
  const single = root.dataset.accordion === 'single';
  const triggers = $$('[data-accordion-trigger]', root);

  /**
   * @param {HTMLElement} trigger
   * @param {boolean} open
   */
  const setOpen = (trigger, open) => {
    trigger.setAttribute('aria-expanded', String(open));
    trigger.closest('.accordion__item')?.classList.toggle('is-open', open);
    const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    if (panel) panel.inert = !open;
  };

  triggers.forEach((t) => setOpen(t, t.getAttribute('aria-expanded') === 'true'));

  root.addEventListener('click', (event) => {
    const trigger = event.target instanceof Element ? event.target.closest('[data-accordion-trigger]') : null;
    if (!(trigger instanceof HTMLElement) || !triggers.includes(trigger)) return;
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    if (single && open) triggers.filter((t) => t !== trigger).forEach((t) => setOpen(t, false));
    setOpen(trigger, open);
  });

  // Navegación con flechas entre encabezados (patrón WAI-ARIA)
  root.addEventListener('keydown', (event) => {
    const index = triggers.indexOf(/** @type {HTMLElement} */ (document.activeElement));
    if (index === -1) return;
    const keyMap = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: triggers.length - 1 };
    const next = keyMap[event.key];
    if (next === undefined) return;
    event.preventDefault();
    triggers[(next + triggers.length) % triggers.length].focus();
  });
}

/** Inicializa todos los `[data-accordion]`. */
export function initAccordions() {
  $$('[data-accordion]').forEach(createAccordion);
}
