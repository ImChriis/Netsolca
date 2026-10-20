import { $, $$ } from './utils.js';

const DESKTOP_QUERY = '(min-width: 1100px)';
const SCROLL_THRESHOLD = 16;

/**
 * Header fijo: estado al hacer scroll, menú móvil accesible e
 * indicador de la sección activa.
 */
export function initHeader() {
  const header = $('[data-header]');
  if (!header) return;

  const nav = $('[data-nav]', header);
  const brand = $('[data-nav-brand]', header);
  const toggle = $('[data-menu-toggle]', header);
  const toggleLabel = $('[data-menu-label]', header);
  const indicator = $('.site-nav__indicator', header);
  const links = $$('[data-nav-link]', header);
  const desktop = window.matchMedia(DESKTOP_QUERY);

  // Mismos datos que renderiza Header.astro, para poder recalcular los href.
  const navConfig = (() => {
    try { return JSON.parse(nav?.dataset.navConfig ?? '[]'); } catch { return []; }
  })();

  /**
   * El header lleva `transition:persist`, así que tras una navegación conserva
   * los href de la página con la que entró: '#inicio' y '#cotizar' son anclas
   * relativas al documento y al cambiar de página resuelven contra la URL nueva
   * ('/servicios#cotizar'). Consecuencias: el enlace activo salía siempre
   * "Inicio" y Cotizar no navegaba desde páginas internas. Se recalculan con
   * las mismas reglas del SSR.
   */
  const refreshHrefs = () => {
    const home = ['/', '', '/index', '/index.html'].includes(window.location.pathname);
    const hrefFor = (item) => item.page || (home ? item.anchor : (item.id === 'inicio' ? '/' : `/${item.anchor}`));

    links.forEach((link) => {
      const item = navConfig.find((candidate) => candidate.id === link.dataset.navLink);
      if (item) link.setAttribute('href', hrefFor(item));
    });
    brand?.setAttribute('href', home ? '#inicio' : '/');
  };

  /* ---------- 1. Fondo translúcido al hacer scroll ---------- */
  let ticking = false;
  const updateScrolled = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrolled);
  }, { passive: true });
  updateScrolled();

  /* ---------- 2. Menú móvil ---------- */
  // Mientras el menú está abierto, el resto de la página queda inerte (trampa de foco).
  const outside = $$('main, footer, .wa-float');

  /**
   * @param {boolean} open
   * @param {{ returnFocus?: boolean }} [options]
   */
  const setMenu = (open, { returnFocus = false } = {}) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    if (toggleLabel) toggleLabel.textContent = open ? 'Cerrar menú' : 'Abrir menú';
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    outside.forEach((el) => { el.inert = open; });

    if (open) links[0]?.focus({ preventScroll: true });
    else if (returnFocus) toggle.focus();
  };

  toggle?.addEventListener('click', () => {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav?.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a') && !desktop.matches) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) setMenu(false, { returnFocus: true });
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
    moveIndicator();
  });

  /* ---------- 3. Sección activa + indicador ---------- */
  /** @type {string | null} */
  let current = null;
  /** @type {IntersectionObserver | null} */
  let observer = null;

  const moveIndicator = () => {
    if (!indicator || !nav) return;
    const link = links.find((l) => l.dataset.navLink === current);
    if (!link || !desktop.matches) {
      indicator.style.setProperty('--ind-o', '0');
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const inset = 12;
    indicator.style.setProperty('--ind-x', `${rect.left - navRect.left + inset}px`);
    indicator.style.setProperty('--ind-w', `${Math.max(rect.width - inset * 2, 12)}px`);
    indicator.style.setProperty('--ind-o', '1');
  };

  /** @param {string} key */
const setActive = (key) => {
  const changed = key !== current;
  current = key;

  if (changed) {
    links.forEach((link) => {
      if (link.dataset.navLink === key) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  moveIndicator();
};

/**
 * Normaliza un pathname para poder compararlo: '/index.html', '/index' y '/'
 * quedan iguales, igual que el pathname de un enlace ancla (#inicio → '/').
 */
const normalizePath = (value) => value.replace(/\/index(\.html?)?$/, '').replace(/\/+$/, '') || '/';

/** Decodifica el hash de la URL de forma segura. */
const hashId = (hash) => {
  if (!hash || hash === '#') return '';
  try { return decodeURIComponent(hash.slice(1)); } catch { return hash.slice(1); }
};

/**
 * Enlace del nav que corresponde a un hash (#cotizar), solo si ese ancla
 * pertenece a esta misma página (desde /servicios, '/#cotizar' es válido).
 */
const navLinkForHash = (hash) => {
  if (!hash || hash === '#') return '';

  const path = normalizePath(window.location.pathname);
  const link = links.find((candidate) => {
    const url = new URL(candidate.href, window.location.origin);
    return url.hash === hash && normalizePath(url.pathname) === path;
  });

  return link?.dataset.navLink ?? '';
};

const activeFromHash = () => {
  const hash = window.location.hash;
  if (!document.getElementById(hashId(hash))) return '';
  return navLinkForHash(hash);
};

const updateCurrentFromUrl = () => {
  const fromHash = activeFromHash();
  if (fromHash) {
    setActive(fromHash);
    return;
  }

  const path = normalizePath(window.location.pathname);
  const link = links.find((candidate) => {
    const url = new URL(candidate.href, window.location.origin);
    return normalizePath(url.pathname) === path;
  });

  setActive(link?.dataset.navLink ?? '');
};

  // Observa las secciones de la página actual. Se recrea en cada navegación:
  // con el ClientRouter el <main> se reemplaza y los nodos viejos quedan sueltos.
  const observeSections = () => {
    observer?.disconnect();
    observer = null;

    const sections = $$('[data-section]');
    if (!('IntersectionObserver' in window) || !sections.length) return;

    // Una línea fina a ~40 % del alto de la ventana decide qué sección está activa.
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const key = /** @type {HTMLElement} */ (entry.target).dataset.section ?? '';
        const link = links.find((l) => l.dataset.navLink === key);

        if (link?.getAttribute('href')?.startsWith('#')) {
          setActive(key);
        }
      });
    }, { rootMargin: '-40% 0px -59% 0px' });
    sections.forEach((section) => observer.observe(section));
  };

  document.addEventListener('astro:before-preparation', () => {
  if (nav?.classList.contains('is-open')) setMenu(false);
});

  /**
   * Recalcula todo tras un cambio de página/ubicación.
   * Se ejecuta en `astro:after-swap` (justo después del swap y de restaurar el
   * scroll) además de en `astro:page-load`, que llega tarde (tras las animaciones)
   * e incluso puede no llegar si la transición se aborta: en ese caso el observer
   * se quedaba mirando el DOM viejo y la línea dejaba de moverse hasta recargar.
   */
  const syncActive = () => {
    refreshHrefs();
    updateCurrentFromUrl();
    observeSections();
    requestAnimationFrame(moveIndicator);
  };

  // En páginas internas el enlace activo viene marcado en el HTML
  syncActive();

  document.addEventListener('astro:after-swap', syncActive);
  document.addEventListener('astro:page-load', syncActive);

  // Navegación dentro de la misma página (#cotizar): el ClientRouter sale
  // temprano y NO emite astro:after-swap/astro:page-load, solo cambia el hash.
  window.addEventListener('hashchange', updateCurrentFromUrl);

  /**
   * Anclas de la misma página (#cotizar).
   * Verificado en navegador: al hacer clic, el ClientRouter cambia la URL con
   * pushState y después asigna location.href a esa misma URL, así que el
   * navegador NO emite `hashchange` (solo un popstate). El scroll suave además
   * se puede cancelar, con lo que el IntersectionObserver dejaba la línea en la
   * última sección que cruzó (o en ninguna). Marcarlo en el clic es lo único
   * determinista, y cubre también los enlaces que no están en el nav
   * (p. ej. el CTA "Cotizar mi proyecto" del hero).
   */
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

    let url;
    try { url = new URL(anchor.href, window.location.origin); } catch { return; }
    if (url.origin !== window.location.origin) return;
    if (normalizePath(url.pathname) !== normalizePath(window.location.pathname)) return;
    if (!document.getElementById(hashId(url.hash))) return;

    const key = navLinkForHash(url.hash);
    if (!key) return;

    setActive(key);
    // Fase de captura: el ClientRouter (y otros scripts) cancelan el
    // comportamiento por defecto de todos los enlaces del mismo origen, así que
    // hay que marcar ANTES de que eso ocurra.
  }, { capture: true });

  window.addEventListener('resize', moveIndicator, { passive: true });
  document.fonts?.ready.then(moveIndicator).catch(() => {});

  // Autoreparación: si el nav cambia de tamaño (fuentes web, zoom, cambio de
  // scrollbar) el trazo se vuelve a medir sin necesidad de recargar.
  if (nav && 'ResizeObserver' in window) {
    new ResizeObserver(() => moveIndicator()).observe(nav);
  }
}
