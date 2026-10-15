/**
 * Lógica pura del cotizador (sin DOM) para poder probarla con `node --test`.
 *
 * @typedef {{ value: string, label: string }} Choice
 * @typedef {{ tipo: Choice | null, usuarios: Choice | null, funciones: Choice[], plazo: Choice | null }} QuoteState
 */

export const QUOTE_STEPS = Object.freeze(['tipo', 'usuarios', 'funciones', 'plazo']);

/** Peso de cada respuesta para estimar el tamaño del proyecto. */
const WEIGHTS = Object.freeze({
  tipo: { pagina: 1, tienda: 2, mejorar: 2, sistema: 3 },
  usuarios: { solo: 0, equipo: 1, empresa: 2, clientes: 2 },
  funcion: 0.5,
});

export const SIZES = Object.freeze([
  { level: 1, label: 'Pequeño', hint: 'Un proyecto ágil, ideal para empezar.' },
  { level: 2, label: 'Mediano', hint: 'Varias funciones trabajando juntas.' },
  { level: 3, label: 'Grande', hint: 'Un sistema completo para tu empresa.' },
]);

/** Estado vacío del cotizador. */
export const emptyState = () => ({ tipo: null, usuarios: null, funciones: [], plazo: null });

/**
 * Cuántas preguntas están respondidas.
 * @param {QuoteState} state
 */
export const countAnswered = (state) => QUOTE_STEPS.filter((step) => {
  const value = state?.[step];
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}).length;

/**
 * Estima el tamaño del proyecto. Sin "tipo" no hay estimación.
 * @param {QuoteState} state
 * @returns {{ level: number, label: string, hint: string, score: number } | null}
 */
export function estimateSize(state) {
  const tipo = state?.tipo?.value;
  if (!tipo) return null;
  const score = (WEIGHTS.tipo[tipo] ?? 2)
    + (WEIGHTS.usuarios[state.usuarios?.value] ?? 0)
    + (state.funciones?.length ?? 0) * WEIGHTS.funcion;
  const size = score <= 2 ? SIZES[0] : score <= 4.5 ? SIZES[1] : SIZES[2];
  return { ...size, score };
}

/**
 * Arma el mensaje (texto plano) que se envía por WhatsApp o al formulario.
 * @param {QuoteState} state
 * @returns {string}
 */
export function buildMessage(state) {
  const lines = ['Hola NETSOLCA, quiero cotizar un proyecto:'];
  if (state?.tipo) lines.push(`• Necesito: ${state.tipo.label}`);
  if (state?.usuarios) lines.push(`• Lo usará: ${state.usuarios.label}`);
  if (state?.funciones?.length) lines.push(`• Funciones: ${state.funciones.map((f) => f.label).join(', ')}`);
  if (state?.plazo) lines.push(`• Para cuándo: ${state.plazo.label}`);
  const size = estimateSize(state);
  if (size) lines.push(`• Tamaño estimado: ${size.label}`);
  return lines.join('\n');
}

/**
 * Enlace de WhatsApp con el mensaje, o null si no hay número configurado.
 * @param {string} number
 * @param {string} message
 */
export function whatsappUrl(number, message) {
  const digits = String(number ?? '').replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
