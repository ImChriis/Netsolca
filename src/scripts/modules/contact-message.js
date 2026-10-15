/**
 * Mensaje de WhatsApp que se arma con los datos del formulario de contacto.
 * Funciones puras (sin DOM) para poder probarlas con `node --test`.
 */

/**
 * @param {{ nombre: string, empresa: string, correo: string, telefono: string, mensaje: string }} data
 * @param {string} serviceLabel Texto visible de la opción elegida en "¿Qué te interesa?"
 * @returns {string}
 */
export function buildContactMessage(data, serviceLabel) {
  const clean = (value) => String(value ?? '').trim().replace(/\s+\n/g, '\n');
  return [
    'Hola NETSOLCA, les escribo desde la página web.',
    '',
    `*Nombre:* ${clean(data.nombre)}`,
    `*Empresa:* ${clean(data.empresa)}`,
    `*Correo:* ${clean(data.correo)}`,
    `*Teléfono:* ${clean(data.telefono)}`,
    `*Me interesa:* ${clean(serviceLabel)}`,
    '',
    '*Lo que necesito:*',
    clean(data.mensaje),
  ].join('\n');
}

