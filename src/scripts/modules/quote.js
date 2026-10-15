import { $, $$ } from './utils.js';
import { buildMessage, emptyState, estimateSize, QUOTE_STEPS, whatsappUrl } from './quote-logic.js';

const AUTO_ADVANCE_MS = 320;

/**
 * Cotizador tipo asistente: una pregunta a la vez y un resumen al final.
 * - Al elegir una opción con el mouse o el dedo avanza solo; con teclado
 *   (flechas) no, para no interrumpir la navegación.
 * - El resumen se envía por WhatsApp o precarga el formulario de contacto.
 * @param {{ number?: string }} [whatsapp]
 */
export function initQuote({ number = '' } = {}) {
  const root = $('[data-quote]');
  const form = /** @type {HTMLFormElement | null} */ ($('[data-quote-form]', root ?? document));
  if (!root || !form) return;

  const steps = $$('[data-step]', form);
  const questions = steps.length - 1; // el último paso es el resumen
  const backBtn = $('[data-wizard-back]', root);
  const nextBtn = $('[data-wizard-next]', root);
  const resetBtn = $('[data-quote-reset]', root);
  const count = $('[data-wizard-count]', root);
  const bar = $('[data-wizard-bar]', root);
  const status = $('[data-quote-status]', root);
  const sendBtn = $('[data-quote-whatsapp]', root);
  const formLink = $('[data-quote-form-link]', root);
  let index = 0;
  let pointerChoice = false;

  /** @param {HTMLInputElement} input */
  const toChoice = (input) => ({ value: input.value, label: input.dataset.label ?? input.value });

  const readState = () => {
    const state = emptyState();
    $$('input:checked', form).forEach((input) => {
      if (input.name === 'funciones') state.funciones.push(toChoice(input));
      else if (QUOTE_STEPS.includes(input.name)) state[input.name] = toChoice(input);
    });
    return state;
  };

  /** ¿La pregunta actual permite avanzar? (las múltiples son opcionales) */
  const canAdvance = (i) => {
    const step = steps[i];
    if (!step || step.hasAttribute('data-summary')) return false;
    return step.hasAttribute('data-multi') || Boolean($('input:checked', step));
  };

  const renderSummary = () => {
    const state = readState();
    QUOTE_STEPS.forEach((key) => {
      const field = $(`[data-quote-field="${key}"]`, root);
      if (!field) return;
      const value = state[key];
      field.textContent = (Array.isArray(value) ? value.map((v) => v.label).join(', ') : value?.label) || 'Sin especificar';
    });
    const size = estimateSize(state);
    const sizeEl = $('[data-quote-size]', root);
    if (sizeEl) sizeEl.textContent = size ? `${size.label}. ${size.hint}` : '—';

    const message = buildMessage(state);
    const service = $('input[name="tipo"]:checked', form)?.dataset.service ?? 'otro';
    const waUrl = whatsappUrl(number, message);

    // Con número: abre WhatsApp. Sin número: precarga el formulario.
    if (sendBtn) {
      if (waUrl) {
        sendBtn.setAttribute('href', waUrl);
        sendBtn.setAttribute('target', '_blank');
        sendBtn.setAttribute('rel', 'noopener');
        sendBtn.removeAttribute('data-contact-prefill');
      } else {
        sendBtn.setAttribute('href', '#contacto');
        sendBtn.setAttribute('data-contact-prefill', '');
      }
    }
    [sendBtn, formLink].forEach((link) => {
      if (!link) return;
      link.dataset.prefillService = service;
      link.dataset.prefillMessage = message;
      link.dataset.prefillOverwrite = '';
    });
    formLink?.setAttribute('data-contact-prefill', '');
  };

  /**
   * @param {number} target
   * @param {{ focus?: boolean }} [options]
   */
  const show = (target, { focus = true } = {}) => {
    const next = Math.max(0, Math.min(steps.length - 1, target));
    root.dataset.dir = next < index ? 'back' : 'forward';
    index = next;

    steps.forEach((step, i) => {
      const active = i === index;
      step.classList.toggle('is-active', active);
      step.inert = !active;
    });

    const onSummary = index === steps.length - 1;
    if (onSummary) renderSummary();
    if (count) count.textContent = onSummary ? 'Resumen' : `Pregunta ${index + 1} de ${questions}`;
    bar?.style.setProperty('--p', String((index + 1) / steps.length));
    if (backBtn) backBtn.hidden = index === 0;
    if (resetBtn) resetBtn.hidden = !onSummary;
    if (nextBtn) {
      nextBtn.hidden = onSummary;
      nextBtn.disabled = !canAdvance(index);
      const isMulti = steps[index]?.hasAttribute('data-multi');
      nextBtn.textContent = isMulti && !$('input:checked', steps[index]) ? 'Saltar' : (index === questions - 1 ? 'Ver resumen' : 'Siguiente');
    }
    if (status) status.textContent = onSummary ? 'Tu cotización está lista.' : `Pregunta ${index + 1} de ${questions}`;
    if (focus) $('.wizard__question', steps[index])?.focus({ preventScroll: true });
  };

  // Distingue elección con puntero (avanza sola) de elección con teclado
  form.addEventListener('pointerdown', () => { pointerChoice = true; });
  form.addEventListener('keydown', () => { pointerChoice = false; });

  form.addEventListener('change', (event) => {
    const input = event.target;
    show(index, { focus: false }); // actualiza el botón Siguiente
    if (input instanceof HTMLInputElement && input.type === 'radio' && pointerChoice) {
      const from = index;
      setTimeout(() => { if (index === from) show(index + 1); }, AUTO_ADVANCE_MS);
    }
  });
  form.addEventListener('submit', (event) => event.preventDefault());

  nextBtn?.addEventListener('click', () => { if (canAdvance(index)) show(index + 1); });
  backBtn?.addEventListener('click', () => show(index - 1));
  resetBtn?.addEventListener('click', () => {
    form.reset();
    show(0);
    if (status) status.textContent = 'Cotizador reiniciado.';
  });

  show(0, { focus: false });
}
