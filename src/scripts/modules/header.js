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
  const toggle = $('[data-menu-toggle]', header);
  const toggleLabel = $('[data-menu-label]', header);
  const indicator = $('.site-nav__indicator', header);
  const links = $$('[data-nav-link]', header);
  const desktop = window.matchMedia(DESKTOP_QUERY);

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
    if (key === current) return;
    current = key;
    links.forEach((link) => {
      if (link.dataset.navLink === key) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    moveIndicator();
  };

  const sections = $$('[data-section]');
  if ('IntersectionObserver' in window && sections.length) {
    // Una línea fina a ~40 % del alto de la ventana decide qué sección está activa.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(/** @type {HTMLElement} */ (entry.target).dataset.section ?? '');
      });
    }, { rootMargin: '-40% 0px -59% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  // En páginas internas (servicios, proyectos) el enlace activo viene marcado en el HTML
  const pageLink = links.find((link) => link.getAttribute('aria-current') === 'page');
  if (pageLink) {
    current = pageLink.dataset.navLink ?? null;
    moveIndicator();
  }

  window.addEventListener('resize', moveIndicator, { passive: true });
  document.fonts?.ready.then(moveIndicator).catch(() => {});
}
