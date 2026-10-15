import { $, prefersReducedMotion } from './utils.js';
import { FIELD_NAMES, MESSAGE_MAX, validateField } from './validators.js';
import { buildContactMessage } from './contact-message.js';
import { whatsappUrl } from './quote-logic.js';

const LABEL_IDLE = 'Enviar por WhatsApp';
const LABEL_LOADING = 'Abriendo WhatsApp…';
const LABEL_RETRY = 'Intentar de nuevo';

/**
 * Abre WhatsApp con el mensaje listo. Debe llamarse dentro del evento submit
 * (gesto de la persona) para que el navegador no bloquee la ventana.
 * @param {string} url
 */
function openWhatsApp(url) {
  const win = window.open(url, '_blank');
  if (win) {
    win.opener = null;
  } else {
    // Ventanas emergentes bloqueadas: se abre en la misma pestaña
    window.location.href = url;
  }
}

/**
 * Formulario de contacto: validación en tiempo real y envío por WhatsApp
 * (se abre el chat con el mensaje ya escrito), con precarga desde otros CTAs
 * del sitio (`[data-contact-prefill]` con `data-prefill-service` / `data-prefill-message`).
 * @param {{ number?: string }} [whatsapp]
 */
export function initContactForm({ number = '' } = {}) {
  const form = /** @type {HTMLFormElement | null} */ ($('[data-contact-form]'));
  if (!form) return;

  const submitBtn = $('[data-submit]', form);
  const submitLabel = $('[data-submit-label]', form);
  const errorAlert = $('[data-form-error]', form);
  const successPanel = $('[data-form-success]', form);
  const successText = $('[data-success-text]', form);
  const successLink = $('[data-success-link]', form);
  const summary = $('[data-form-summary]', form);
  const counter = $('[data-char-count]', form);

  /** @type {Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} */
  const fields = FIELD_NAMES
    .map((name) => form.elements.namedItem(name))
    .filter((el) => el instanceof HTMLElement);
  const field = (name) => fields.find((f) => f.name === name);

  /** Campos con los que la persona ya interactuó: solo esos muestran error en vivo. */
  const touched = new Set();

  /* ---------- Validación ---------- */
  const paint = (input, message) => {
    const invalid = Boolean(message);
    input.setAttribute('aria-invalid', String(invalid));
    input.closest('.field')?.classList.toggle('is-valid', !invalid && touched.has(input.name));
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = message;
  };

  const check = (input) => {
    const message = validateField(input.name, input.value);
    paint(input, message);
    return message;
  };

  const updateCounter = () => {
    const message = field('mensaje');
    if (!counter || !message) return;
    const length = message.value.length;
    counter.textContent = `${length} / ${MESSAGE_MAX}`;
    counter.classList.toggle('is-near-limit', length > MESSAGE_MAX * 0.9);
  };

  form.addEventListener('input', (event) => {
    const input = event.target;
    if (!fields.includes(input)) return;
    if (input.name === 'mensaje') updateCounter();
    if (touched.has(input.name)) check(input);
  });

  form.addEventListener('change', (event) => {
    const input = event.target;
    if (input instanceof HTMLSelectElement && fields.includes(input)) {
      touched.add(input.name);
      check(input);
    }
  });

  // Al salir de un campo con contenido, empieza a validarse en vivo
  form.addEventListener('focusout', (event) => {
    const input = event.target;
    if (!fields.includes(input)) return;
    if (!input.value.trim() && !touched.has(input.name)) return;
    touched.add(input.name);
    check(input);
  });

  /* ---------- Estados ---------- */
  /**
   * @param {'idle' | 'loading' | 'success' | 'error'} state
   * @param {string} [waUrl] Enlace de WhatsApp para reabrir el chat desde el panel de éxito
   */
  const setState = (state, waUrl = '') => {
    form.dataset.state = state;
    const loading = state === 'loading';
    form.setAttribute('aria-busy', String(loading));
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.classList.toggle('is-loading', loading);
    }
    if (submitLabel) submitLabel.textContent = { loading: LABEL_LOADING, error: LABEL_RETRY }[state] ?? LABEL_IDLE;
    if (errorAlert) errorAlert.hidden = state !== 'error';

    if (state === 'success' && successPanel) {
      const firstName = field('nombre')?.value.trim().split(/\s+/)[0] ?? '';
      if (successText) {
        successText.textContent = `Gracias, ${firstName}. Abrimos WhatsApp con tu mensaje listo: solo presiona Enviar en el chat.`;
      }
      if (successLink) {
        successLink.hidden = !waUrl;
        if (waUrl) successLink.setAttribute('href', waUrl);
      }
      successPanel.hidden = false;
      successPanel.focus();
    }
  };

  const resetForm = () => {
    form.reset();
    touched.clear();
    fields.forEach((input) => {
      input.removeAttribute('aria-invalid');
      input.closest('.field')?.classList.remove('is-valid');
      const error = document.getElementById(`${input.id}-error`);
      if (error) error.textContent = '';
    });
    updateCounter();
    if (successPanel) successPanel.hidden = true;
    setState('idle');
  };

  $('[data-form-reset]', form)?.addEventListener('click', () => {
    resetForm();
    field('nombre')?.focus();
  });

  /* ---------- Envío ---------- */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.dataset.state === 'loading') return;

    // Honeypot: un bot lo completa; respondemos "éxito" sin enviar nada.
    const honeypot = form.elements.namedItem('website');
    if (honeypot instanceof HTMLInputElement && honeypot.value) {
      setState('success');
      return;
    }

    fields.forEach((input) => touched.add(input.name));
    const invalid = fields.filter((input) => check(input));
    if (invalid.length) {
      if (summary) {
        summary.textContent = invalid.length === 1
          ? 'Revisa el campo marcado antes de enviar.'
          : `Revisa los ${invalid.length} campos marcados antes de enviar.`;
      }
      invalid[0].focus();
      return;
    }

    if (summary) summary.textContent = '';

    const data = Object.fromEntries(fields.map((input) => [input.name, input.value.trim()]));
    const service = field('servicio');
    const serviceLabel = service instanceof HTMLSelectElement
      ? service.selectedOptions[0]?.textContent?.trim() ?? data.servicio
      : data.servicio;
    const url = whatsappUrl(number, buildContactMessage(data, serviceLabel));
    if (!url) {
      console.error('[contacto] Falta whatsapp.number en src/scripts/config.js');
      setState('error');
      return;
    }

    setState('loading');
    openWhatsApp(url);
    setState('success', url);
  });

  /* ---------- Precarga desde otros CTAs ---------- */
  document.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('[data-contact-prefill]') : null;
    if (!(link instanceof HTMLElement)) return;
    event.preventDefault();

    const dialog = link.closest('dialog');
    if (dialog?.open) dialog.close();
    if (successPanel && !successPanel.hidden) resetForm();

    const { prefillService, prefillMessage, prefillOverwrite } = link.dataset;
    const service = field('servicio');
    if (prefillService && service) {
      service.value = prefillService;
      touched.add(service.name);
      check(service);
    }
    const message = field('mensaje');
    // El cotizador reemplaza el mensaje; los demás CTAs solo lo completan si está vacío.
    const canWrite = prefillOverwrite !== undefined || !message?.value.trim();
    if (prefillMessage && message && canWrite) {
      message.value = prefillMessage;
      updateCounter();
      if (touched.has(message.name)) check(message);
    }

    (form.closest('section') ?? form).scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
    field('nombre')?.focus({ preventScroll: true });
  });

  updateCounter();
}
