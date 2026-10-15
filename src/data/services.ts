/**
 * Servicios de NETSOLCA. Alimenta el inicio, /servicios, el pie de página y los datos estructurados (SEO).
 * Para editar un servicio, cambia aquí su texto: todas las páginas se actualizan solas.
 */
export interface Service {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  summary: string;
  intro: string;
  includes: string[];
  idealFor: string;
  /** Id de la foto en Unsplash (reemplazar por fotos propias cuando existan) */
  photo: string;
  group: 'sistemas' | 'presencia';
  featuredOnHome: boolean;
}

export const services: Service[] = [
  {
    "id": "erp",
    "icon": "i-erp",
    "title": "ERP",
    "subtitle": "Gestión de toda la empresa",
    "summary": "Contabilidad, ventas, inventario, bancos y nómina en un solo sistema. Información confiable para decidir con certeza.",
    "intro": "Un solo sistema para administrar tu empresa completa, en lugar de varios programas que no se comunican entre sí.",
    "includes": [
      "Contabilidad, bancos y cuentas por cobrar y por pagar",
      "Ventas, compras, inventario y punto de venta",
      "Nómina y reportes para la gerencia",
      "Conexión con facturación, pagos y otras herramientas"
    ],
    "idealFor": "tu información está repartida entre hojas de cálculo y programas distintos.",
    "photo": "1460925895917-afdab827c52f",
    "group": "sistemas",
    "featuredOnHome": false
  },
  {
    "id": "mrp",
    "icon": "i-mrp",
    "title": "MRP",
    "subtitle": "Control de la producción",
    "summary": "Planifica la fabricación de principio a fin: materiales, órdenes de producción e indicadores de planta en tiempo real.",
    "intro": "Para empresas que fabrican: planifica qué producir, con qué materiales y cuándo, y sigue cada orden en tiempo real.",
    "includes": [
      "Planificación de la producción y de materiales",
      "Órdenes de producción con seguimiento por etapa",
      "Indicadores de rendimiento de la planta",
      "Conexión con inventario y compras"
    ],
    "idealFor": "fabricas productos y te faltan o sobran materiales con frecuencia.",
    "photo": "1581091226825-a6a2a5aee158",
    "group": "sistemas",
    "featuredOnHome": false
  },
  {
    "id": "crm",
    "icon": "i-users",
    "title": "CRM",
    "subtitle": "Seguimiento de clientes",
    "summary": "Organiza tus prospectos y ventas: cada contacto, cada cotización y cada seguimiento en un mismo lugar.",
    "intro": "Organiza a tus clientes y prospectos para que ninguna oportunidad de venta se pierda.",
    "includes": [
      "Ficha de cada cliente con su historial",
      "Etapas de venta claras, de la cotización al cierre",
      "Recordatorios de seguimiento por WhatsApp o correo",
      "Reportes de ventas por vendedor"
    ],
    "idealFor": "tu equipo de ventas lleva los clientes en libretas o en el teléfono de cada vendedor.",
    "photo": "1552664730-d307ca884978",
    "group": "sistemas",
    "featuredOnHome": false
  },
  {
    "id": "hosting",
    "icon": "i-cloud",
    "title": "Hosting en la nube",
    "subtitle": "Tu sistema siempre disponible",
    "summary": "Alojamos tu sistema en servidores seguros, con copias de respaldo y monitoreo, sin que tengas que comprar equipos.",
    "intro": "Tu sistema y tu página funcionando en servidores seguros, disponibles desde cualquier lugar y sin comprar equipos.",
    "includes": [
      "Alojamiento seguro con certificado SSL",
      "Copias de respaldo automáticas",
      "Monitoreo para detectar fallas antes que tus clientes",
      "Dominio y correos con el nombre de tu empresa"
    ],
    "idealFor": "quieres que tu sistema esté siempre disponible sin preocuparte por servidores.",
    "photo": "1558494949-ef010cbdcc31",
    "group": "sistemas",
    "featuredOnHome": false
  },
  {
    "id": "paginas",
    "icon": "i-browser",
    "title": "Páginas web",
    "subtitle": "Tu empresa en internet",
    "summary": "Una página profesional, rápida y fácil de ver en el celular, para que tus clientes te encuentren y te escriban.",
    "intro": "Tu carta de presentación en internet: clara, rápida y fácil de ver en el celular, con un botón para que te escriban por WhatsApp.",
    "includes": [
      "Diseño a la medida de tu marca",
      "Que aparezca en Google cuando te buscan",
      "Formulario de contacto y botón de WhatsApp",
      "Dominio, alojamiento y correo con tu nombre"
    ],
    "idealFor": "tus clientes te buscan en internet y todavía no te encuentran.",
    "photo": "1559526324-4b87b5e36e44",
    "group": "presencia",
    "featuredOnHome": true
  },
  {
    "id": "tiendas",
    "icon": "i-cart",
    "title": "Tiendas en línea",
    "subtitle": "Vende las 24 horas",
    "summary": "Catálogo, carrito y pagos en línea, con pedidos e inventario conectados a tu sistema.",
    "intro": "Una tienda abierta las 24 horas donde tus clientes ven tus productos, hacen su pedido y pagan.",
    "includes": [
      "Catálogo de productos con fotos y precios",
      "Carrito de compras y pagos en línea",
      "Control de pedidos e inventario",
      "Avisos de pedidos nuevos por correo o WhatsApp"
    ],
    "idealFor": "vendes por redes sociales y quieres ordenar tus ventas.",
    "photo": "1607082348824-0a96f2a4b9da",
    "group": "presencia",
    "featuredOnHome": true
  },
  {
    "id": "soporte",
    "icon": "i-headset",
    "title": "Soporte 24/7",
    "subtitle": "Atención a cualquier hora",
    "summary": "Mantenimiento, actualizaciones y respuesta inmediata cuando algo no funciona, todos los días del año.",
    "intro": "Estamos disponibles las 24 horas, todos los días, para que tu sistema y tu página sigan funcionando.",
    "includes": [
      "Atención a cualquier hora por WhatsApp y teléfono",
      "Copias de seguridad de tu información",
      "Actualizaciones y mantenimiento",
      "Mejoras cuando tu negocio lo necesite"
    ],
    "idealFor": "tu negocio no puede detenerse por un problema técnico.",
    "photo": "1504639725590-34d0984388bd",
    "group": "presencia",
    "featuredOnHome": true
  },
  {
    "id": "redes",
    "icon": "i-network",
    "title": "Redes y equipos",
    "subtitle": "Oficina conectada",
    "summary": "Instalamos y mantenemos la red, el wifi y los equipos de tu oficina para que tu sistema funcione sin cortes.",
    "intro": "Para que tu sistema funcione bien, tu oficina necesita buen internet y equipos en orden. También nos encargamos de eso.",
    "includes": [
      "Instalación de cableado y wifi en la oficina",
      "Configuración de computadoras, servidores e impresoras",
      "Protección contra virus y accesos no autorizados",
      "Revisión y mantenimiento periódico"
    ],
    "idealFor": "el internet se cae seguido o los equipos de la oficina están desordenados.",
    "photo": "1520869562399-e772f042f422",
    "group": "presencia",
    "featuredOnHome": true
  }
];
