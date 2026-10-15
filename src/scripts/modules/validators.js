/**
 * Reglas de validación del formulario de contacto.
 * Funciones puras (sin DOM) para poder probarlas con `node --test`.
 * Cada regla devuelve '' si el valor es válido, o el mensaje de error.
 */

export const FIELD_NAMES = Object.freeze(['nombre', 'empresa', 'correo', 'telefono', 'servicio', 'mensaje']);
export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^\p{L}[\p{L}\p{M}\s'.-]*$/u;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

/** @type {Readonly<Record<string, (value: string) => string>>} */
export const rules = Object.freeze({
  nombre(value) {
    const v = value.trim();
    if (!v) return 'Escribe tu nombre y apellido.';
    if (v.length < 3) return 'El nombre debe tener al menos 3 letras.';
    if (!NAME_RE.test(v)) return 'Usa solo letras y espacios en el nombre.';
    return '';
  },
  empresa(value) {
    const v = value.trim();
    if (!v) return 'Escribe el nombre de tu empresa.';
    if (v.length < 2) return 'El nombre de la empresa es demasiado corto.';
    return '';
  },
  correo(value) {
    const v = value.trim();
    if (!v) return 'Escribe tu correo electrónico.';
    if (!EMAIL_RE.test(v)) return 'Escribe un correo válido, por ejemplo nombre@empresa.com.';
    return '';
  },
  telefono(value) {
    const v = value.trim();
    if (!v) return 'Escribe un número de teléfono.';
    const digits = v.replace(/\D/g, '');
    if (!PHONE_CHARS_RE.test(v) || digits.length < 10 || digits.length > 15) {
      return 'Escribe un teléfono válido con código de área, por ejemplo +58 412 000 0000.';
    }
    return '';
  },
  servicio(value) {
    return value ? '' : 'Selecciona el servicio que te interesa.';
  },
  mensaje(value) {
    const v = value.trim();
    if (!v) return 'Cuéntanos brevemente qué necesitas.';
    if (v.length < MESSAGE_MIN) return `Agrega un poco más de detalle (mínimo ${MESSAGE_MIN} caracteres).`;
    if (v.length > MESSAGE_MAX) return `El mensaje supera los ${MESSAGE_MAX} caracteres.`;
    return '';
  },
});

/**
 * Valida un campo por nombre. Campos sin regla se consideran válidos.
 * @param {string} name
 * @param {unknown} value
 * @returns {string} Mensaje de error o cadena vacía.
 */
export const validateField = (name, value) => rules[name]?.(String(value ?? '')) ?? '';

/**
 * Valida todos los campos conocidos.
 * @param {Record<string, unknown>} data
 * @returns {Record<string, string>} Solo los campos con error.
 */
export const validateAll = (data) => Object.fromEntries(
  FIELD_NAMES
    .map((name) => [name, validateField(name, data?.[name])])
    .filter(([, message]) => message),
);
