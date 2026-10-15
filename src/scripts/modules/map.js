import { $, prefersReducedMotion } from './utils.js';

const LEAFLET = Object.freeze({
  css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  cssIntegrity: 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
  js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  jsIntegrity: 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
});
// Teselas estándar de OpenStreetMap (sin clave). Para mucho tráfico, usar un proveedor con plan propio.
const TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Carga Leaflet (CSS + JS) una sola vez. */
let leafletPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  leafletPromise ??= new Promise((resolve, reject) => {
    const link = Object.assign(document.createElement('link'), {
      rel: 'stylesheet', href: LEAFLET.css, integrity: LEAFLET.cssIntegrity, crossOrigin: '',
    });
    const script = Object.assign(document.createElement('script'), {
      src: LEAFLET.js, integrity: LEAFLET.jsIntegrity, crossOrigin: '', async: true,
    });
    script.addEventListener('load', () => (window.L ? resolve(window.L) : reject(new Error('Leaflet no disponible'))));
    script.addEventListener('error', () => reject(new Error('No se pudo cargar Leaflet')));
    document.head.append(link, script);
  });
  return leafletPromise;
}

/**
 * Mapa interactivo: se carga cuando la sección se acerca a la pantalla.
 * La rueda del mouse solo hace zoom después de hacer clic en el mapa,
 * para no secuestrar el scroll de la página.
 * @param {{ lat: number, lng: number, zoom?: number, label?: string }} options
 */
export function initMap({ lat, lng, zoom = 16, label = 'Maracaibo, Zulia, Venezuela' }) {
  const box = $('[data-map]');
  const canvas = $('[data-map-canvas]', box ?? document);
  if (!box || !canvas) return;

  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const waze = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  $('[data-map-directions]', box)?.setAttribute('href', directions);
  $('[data-map-waze]', box)?.setAttribute('href', waze);

  const hint = Object.assign(document.createElement('p'), { className: 'map__hint', textContent: 'Haz clic en el mapa para usar el zoom' });
  hint.setAttribute('aria-hidden', 'true');
  box.append(hint);

  const showFallback = () => {
    canvas.innerHTML = `<div class="map__fallback"><p>No pudimos cargar el mapa.</p><a href="${directions}" target="_blank" rel="noopener">Ver la ubicación en Google Maps</a></div>`;
  };

  const build = async () => {
    try {
      const L = await loadLeaflet();
      const center = [lat, lng];
      const map = L.map(canvas, {
        center,
        zoom,
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile,
        zoomControl: false,
        attributionControl: true,
      });
      L.control.zoom({ position: 'bottomright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(map);
      L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

      // Área de la oficina y marcador con la "N" de la marca
      L.circle(center, { radius: 140, color: '#18C8F0', weight: 1.5, fillColor: '#18C8F0', fillOpacity: 0.08 }).addTo(map);
      const icon = L.divIcon({
        className: '',
        html: '<span class="map-pin"><span><img src="/assets/img/icon-n-180.png" alt=""></span></span>',
        iconSize: [52, 52],
        iconAnchor: [26, 26],
        popupAnchor: [0, -24],
      });
      L.marker(center, { icon, title: 'NETSOLCA', alt: 'Ubicación de NETSOLCA' })
        .addTo(map)
        .bindPopup(`<strong>NETSOLCA</strong><br>${label}<br>Atención 24/7<br><a href="${directions}" target="_blank" rel="noopener">Google Maps</a> · <a href="${waze}" target="_blank" rel="noopener">Waze</a>`);

      // Zoom con rueda solo tras interactuar
      map.on('click focus', () => { map.scrollWheelZoom.enable(); box.classList.add('is-active'); });
      box.addEventListener('mouseleave', () => { map.scrollWheelZoom.disable(); box.classList.remove('is-active'); });

      $('[data-map-recenter]', box)?.addEventListener('click', () => {
        map.flyTo(center, zoom, { animate: !prefersReducedMotion(), duration: 0.8 });
      });
    } catch (error) {
      console.error('[mapa]', error);
      showFallback();
    }
  };

  if (!('IntersectionObserver' in window)) { build(); return; }
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    build();
  }, { rootMargin: '400px 0px' });
  observer.observe(box);
}
