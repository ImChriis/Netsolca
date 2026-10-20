import { $, $$, onPageLeave, pageSignal, prefersReducedMotion } from './utils.js';

/**
 * Animaciones con Anime.js (v3, cargado bajo demanda desde cdnjs):
 *  1. "Así trabajamos": la traza se dibuja, cada paso se enciende al pasar
 *     la línea y luego un paquete de luz la recorre en bucle.
 *  2. Maqueta del inicio: el sistema "trabaja" solo (pedidos que suben,
 *     barras que cambian, facturas que se cobran).
 * Si la librería no carga o se pide movimiento reducido, el sitio queda
 * igual que antes (las transiciones CSS siguen funcionando).
 */
const ANIME_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js';
const MOBILE = window.matchMedia('(max-width: 759.98px)');

const rand = (min, max) => Math.round(min + Math.random() * (max - min));
const clampNum = (v, min, max) => Math.min(max, Math.max(min, v));

/** @type {Promise<any> | null} */
let animePromise = null;
function loadAnime() {
  if (window.anime) return Promise.resolve(window.anime);
  animePromise ??= new Promise((resolve, reject) => {
    const script = Object.assign(document.createElement('script'), { src: ANIME_SRC, async: true, crossOrigin: 'anonymous' });
    script.addEventListener('load', () => (window.anime ? resolve(window.anime) : reject(new Error('Anime.js no disponible'))));
    script.addEventListener('error', () => reject(new Error('No se pudo cargar Anime.js')));
    document.head.append(script);
  });
  return animePromise;
}

/**
 * Ejecuta `onEnter`/`onLeave` cuando el elemento entra o sale de pantalla.
 * @param {Element} el
 * @param {{ onEnter: () => void, onLeave?: () => void, threshold?: number }} handlers
 */
function watch(el, { onEnter, onLeave = () => {}, threshold = 0.3 }) {
  const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? onEnter() : onLeave()), { threshold });
  observer.observe(el);
  onPageLeave(() => { observer.disconnect(); onLeave(); });
}

/* ------------------------------------------------------------------ */
/* 1. Proceso: la traza se dibuja y enciende cada paso                  */
/* ------------------------------------------------------------------ */
function initProcess(anime) {
  const root = $('[data-process]');
  const fill = $('[data-process-fill]', root ?? document);
  const packet = $('[data-process-packet]', root ?? document);
  if (!root || !fill || !packet) return;

  const steps = $$('.process__step', root);
  const nodes = steps.map((step) => $('.process__node', step));
  const texts = steps.map((step) => $$('h4, p', step));
  const LINE_MS = 1600;

  anime.set(nodes, { scale: 0.4, opacity: 0 });
  anime.set(texts.flat(), { opacity: 0, translateY: 14 });

  let packetAnim = null;
  const runPacket = () => {
    packetAnim?.pause();
    anime.set(packet, { translateX: 0, translateY: 0, opacity: 0 });
    const rail = packet.parentElement;
    const vertical = MOBILE.matches;
    packetAnim = anime({
      targets: packet,
      keyframes: [
        { opacity: 1, duration: 250 },
        vertical ? { translateY: rail.offsetHeight, duration: 2800 } : { translateX: rail.offsetWidth, duration: 2800 },
        { opacity: 0, duration: 250 },
      ],
      easing: 'easeInOutSine',
      delay: 900,
      loop: true,
    });
  };

  let played = false;
  const play = () => {
    played = true;
    const axis = MOBILE.matches ? 'scaleY' : 'scaleX';
    const tl = anime.timeline({ easing: 'easeOutQuart' });
    tl.add({ targets: fill, [axis]: [0, 1], duration: LINE_MS, easing: 'easeInOutQuad' }, 0);
    nodes.forEach((node, i) => {
      const at = (LINE_MS * i) / Math.max(1, nodes.length - 1);
      tl.add({ targets: node, scale: [0.4, 1], opacity: [0, 1], duration: 650, easing: 'easeOutBack' }, at);
      tl.add({ targets: texts[i], opacity: [0, 1], translateY: [14, 0], duration: 600, delay: anime.stagger(90) }, at + 140);
    });
    tl.finished.then(() => {
      // Libera los estilos en línea para que el hover CSS vuelva a funcionar
      nodes.forEach((node) => { node.style.removeProperty('transform'); });
      runPacket();
    });
  };

  watch(root, {
    threshold: 0.35,
    onEnter: () => { if (!played) play(); else packetAnim?.play(); },
    onLeave: () => packetAnim?.pause(),
  });

  // Al cambiar entre vertical y horizontal se recalcula el recorrido
  MOBILE.addEventListener('change', () => {
    if (!played) return;
    anime.set(fill, { scaleX: 1, scaleY: 1 });
    runPacket();
  }, { signal: pageSignal() });
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (played) runPacket(); }, 250);
  }, { passive: true, signal: pageSignal() });
  onPageLeave(() => clearTimeout(resizeTimer));
}

/* ------------------------------------------------------------------ */
/* 2. Maqueta del inicio: un sistema que "trabaja" solo                 */
/* ------------------------------------------------------------------ */
function initLiveMockup(anime) {
  const svg = $('[data-mock]');
  if (!svg) return;

  const BASE = 88;          // línea base de las barras (coordenadas del SVG)
  const STEP_X = 38;
  const MAX_H = 72;
  const TICK_MS = 3200;

  const bars = $$('[data-bar]', svg);
  const line = $('[data-mock-line]', svg);
  const kpi = {
    pedidos: $('[data-kpi="pedidos"]', svg),
    clientes: $('[data-kpi="clientes"]', svg),
    ventas: $('[data-kpi="ventas"]', svg),
  };
  const table = $('[data-mock-rows]', svg);
  const rowEls = $$('[data-row]', svg);

  let heights = bars.map((bar) => Number(bar.getAttribute('height')));
  const counters = { pedidos: 128, clientes: 54 };
  let rows = [{ n: 1042, paid: true }, { n: 1043, paid: false }];
  let nextInvoice = 1044;
  let tickCount = 0;
  let timer = 0;
  let running = false;

  const lineD = (hs) => `M${hs.map((h, i) => `${26 + STEP_X * i} ${BASE - h - 8}`).join(' L')}`;

  /** Anima un número de texto desde su valor actual hasta `to`. */
  const countTo = (el, from, to, format = (v) => String(v)) => {
    const obj = { v: from };
    anime({ targets: obj, v: to, round: 1, duration: 900, easing: 'easeOutQuart', update: () => { el.textContent = format(obj.v); } });
  };

  const renderRows = () => {
    rowEls.forEach((rowEl, i) => {
      const row = rows[i];
      $('[data-num]', rowEl).textContent = `Factura ${row.n}`;
      const pill = $('[data-pill]', rowEl);
      pill.classList.toggle('mock-pill--ok', row.paid);
      pill.classList.toggle('mock-pill--wait', !row.paid);
      $('[data-status]', rowEl).textContent = row.paid ? 'Pagada' : 'Pendiente';
    });
  };

  const collectInvoice = () => {
    // 1) La factura pendiente se cobra
    rows[1] = { ...rows[1], paid: true };
    renderRows();
    anime({ targets: $('[data-pill]', rowEls[1]), scale: [1, 1.18, 1], duration: 600, easing: 'easeOutQuad' });
    // 2) Entra una factura nueva y la tabla se desplaza
    setTimeout(() => {
      anime({
        targets: table,
        opacity: [1, 0],
        translateY: [0, -6],
        duration: 320,
        easing: 'easeInQuad',
        complete: () => {
          rows = [rows[1], { n: nextInvoice++, paid: false }];
          renderRows();
          anime({ targets: table, opacity: [0, 1], translateY: [8, 0], duration: 420, easing: 'easeOutQuad' });
        },
      });
    }, 1400);
  };

  const tick = () => {
    tickCount += 1;
    // Las ventas de hoy crecen; el resto de la semana varía un poco
    let next = heights.map((h, i) => (i === heights.length - 1 ? h + rand(3, 7) : clampNum(h + rand(-6, 6), 18, 60)));
    if (next[next.length - 1] > MAX_H) next = [...next.slice(1), rand(22, 32)]; // empieza un día nuevo
    heights = next;

    anime({
      targets: bars,
      height: (_, i) => heights[i],
      y: (_, i) => BASE - heights[i],
      duration: 900,
      easing: 'easeOutElastic(1, .75)',
    });
    if (line) anime({ targets: line, d: lineD(heights), duration: 900, easing: 'easeOutQuart' });

    const before = { ...counters };
    counters.pedidos += rand(1, 4);
    if (Math.random() < 0.4) counters.clientes += 1;
    if (kpi.pedidos) countTo(kpi.pedidos, before.pedidos, counters.pedidos);
    if (kpi.clientes && before.clientes !== counters.clientes) countTo(kpi.clientes, before.clientes, counters.clientes);

    const others = heights.slice(0, -1);
    const avg = others.reduce((a, b) => a + b, 0) / others.length;
    // Variación de hoy frente al promedio de la semana, acotada a un rango creíble
    const pct = clampNum(Math.round((heights[heights.length - 1] / avg - 1) * 100), 4, 38);
    if (kpi.ventas) kpi.ventas.textContent = `+${pct}%`;

    if (tickCount % 2 === 0) collectInvoice();
  };

  const loop = () => { tick(); timer = window.setTimeout(loop, TICK_MS); };
  const start = () => {
    if (running || document.hidden) return;
    running = true;
    timer = window.setTimeout(loop, 2600); // deja terminar la entrada del hero
  };
  const stop = () => { running = false; clearTimeout(timer); };

  if (line) line.setAttribute('d', lineD(heights));
  watch(svg, { threshold: 0.2, onEnter: start, onLeave: stop });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()), { signal: pageSignal() });
}

/** Inicializa las animaciones avanzadas (si el usuario no pidió movimiento reducido). */
export function initMotion() {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  loadAnime()
    .then((anime) => {
      document.documentElement.classList.add('has-motion-lib');
      initProcess(anime);
      initLiveMockup(anime);
    })
    .catch((error) => console.warn('[animaciones]', error.message));
}
