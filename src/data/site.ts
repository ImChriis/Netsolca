/**
 * Datos generales de NETSOLCA: SEO, datos estructurados, menú y contacto.
 */
export const SITE = {
  name: 'NETSOLCA',
  taxId: 'J-410000236',
  title: 'NETSOLCA | Sistemas web a la medida en Maracaibo, Venezuela',
  description:
    'Desarrollamos sistemas web, ERP, MRP y CRM, páginas y tiendas en línea para empresas, desde Maracaibo, Venezuela. Más de 20 años de trayectoria y atención 24/7.',
  locale: 'es_VE',
  lang: 'es',
  themeColor: '#0A1640',
  ogImage: '/og-image.png',
  ogImageAlt: 'NETSOLCA: sistemas web a la medida en Maracaibo, Venezuela',
  foundingYearsLabel: '+20 años de trayectoria',
  address: {
    locality: 'Maracaibo',
    region: 'Zulia',
    regionCode: 'VE-V',
    country: 'VE',
  },
  /** Ubicación de la oficina (mapa, datos estructurados y "Cómo llegar") */
  geo: { lat: 10.661910170306777, lng: -71.60647260827808 },
  phone: '+58 414 641 6366',
  /** Teléfono en formato internacional sin espacios (tel: y WhatsApp) */
  phoneIntl: '+584146416366',
  email: 'netsolca@gmail.com',
  social: [
    { name: 'Instagram', handle: '@netsolca.ve', url: 'https://www.instagram.com/netsolca.ve/', icon: 'i-instagram' },
    { name: 'TikTok', handle: '@netsolca.ve', url: 'https://www.tiktok.com/@netsolca.ve', icon: 'i-tiktok' },
  ],
} as const;

/** Enlace directo a WhatsApp (sin mensaje) */
export const WHATSAPP_URL = `https://wa.me/${SITE.phoneIntl.replace(/\D/g, '')}`;
/** Rutas para llegar a la oficina */
export const DIRECTIONS = {
  google: `https://www.google.com/maps/dir/?api=1&destination=${SITE.geo.lat},${SITE.geo.lng}`,
  waze: `https://waze.com/ul?ll=${SITE.geo.lat},${SITE.geo.lng}&navigate=yes`,
};

export interface NavItem {
  id: string;
  label: string;
  /** Ancla en el inicio */
  anchor: string;
  /** Página propia, si existe */
  page?: string;
}

export const NAV: NavItem[] = [
  { id: 'inicio', label: 'Inicio', anchor: '#inicio' },
  { id: 'servicios', label: 'Servicios', anchor: '#servicios', page: '/servicios' },
  { id: 'proyectos', label: 'Proyectos', anchor: '#proyectos', page: '/proyectos' },
  { id: 'cotizar', label: 'Cotizar', anchor: '#cotizar' },
  { id: 'nosotros', label: 'Nosotros', anchor: '#nosotros', page: '/nosotros' },
  { id: 'contacto', label: 'Contacto', anchor: '#contacto', page: '/contacto' },
];

/** URL de una foto de Unsplash (o una ruta propia si empieza por "/"). */
export function photoUrl(photo: string, width: number, height: number, quality = 65): string {
  if (photo.startsWith('/')) return photo;
  return `https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=${width}&h=${height}&q=${quality}`;
}

/**
 * src y srcset de una foto. Las propias (/assets/img/servicios/erp) tienen
 * dos tamaños en WebP: -640.webp y -1200.webp; las de Unsplash se piden al CDN.
 */
export function photoSources(photo: string, width: number, height: number): { src: string; srcset: string } {
  if (photo.startsWith('/')) {
    return { src: `${photo}-1200.webp`, srcset: `${photo}-640.webp 640w, ${photo}-1200.webp 1200w` };
  }
  const half = (n: number) => Math.round(n / 2);
  return {
    src: photoUrl(photo, width, height),
    srcset: `${photoUrl(photo, half(width), half(height))} ${half(width)}w, ${photoUrl(photo, width, height)} ${width}w`,
  };
}
