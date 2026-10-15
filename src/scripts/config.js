/**
 * Configuración central del sitio NETSOLCA.
 */
export const config = Object.freeze({
  whatsapp: Object.freeze({
    // Número en formato internacional, solo dígitos (58 + código de área + número).
    number: '584146416366',
    message: 'Hola NETSOLCA, quiero información para crear un sistema o página web para mi negocio.',
  }),

  map: Object.freeze({
    // Ubicación de la oficina (igual que SITE.geo en src/data/site.ts)
    lat: 10.661910170306777,
    lng: -71.60647260827808,
    zoom: 16,
    label: 'Maracaibo, estado Zulia, Venezuela',
  }),
});
