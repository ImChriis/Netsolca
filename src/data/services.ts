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
  /**
   * Foto propia sin extensión: /assets/img/servicios/erp → erp-640.webp y erp-1200.webp (4:3).
   * También acepta el id de una foto de Unsplash.
   */
  photo: string;
  /** Descripción de la foto (accesibilidad y SEO) */
  photoAlt?: string;
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
    "photo": "/assets/img/servicios/erp",
    "photoAlt": "Laptop con un panel de ventas y gráficos de la empresa",
    "group": "sistemas",
    "featuredOnHome": false
  },
  // {
  //   "id": "mrp",
  //   "icon": "i-mrp",
  //   "title": "MRP",
  //   "subtitle": "Control de la producción",
  //   "summary": "Planifica la fabricación de principio a fin: materiales, órdenes de producción e indicadores de planta en tiempo real.",
  //   "intro": "Para empresas que fabrican: planifica qué producir, con qué materiales y cuándo, y sigue cada orden en tiempo real.",
  //   "includes": [
  //     "Planificación de la producción y de materiales",
  //     "Órdenes de producción con seguimiento por etapa",
  //     "Indicadores de rendimiento de la planta",
  //     "Conexión con inventario y compras"
  //   ],
  //   "idealFor": "fabricas productos y te faltan o sobran materiales con frecuencia.",
  //   "photo": "1581091226825-a6a2a5aee158",
  //   "group": "sistemas",
  //   "featuredOnHome": false
  // },
  // {
  //   "id": "crm",
  //   "icon": "i-users",
  //   "title": "CRM",
  //   "subtitle": "Seguimiento de clientes",
  //   "summary": "Organiza tus prospectos y ventas: cada contacto, cada cotización y cada seguimiento en un mismo lugar.",
  //   "intro": "Organiza a tus clientes y prospectos para que ninguna oportunidad de venta se pierda.",
  //   "includes": [
  //     "Ficha de cada cliente con su historial",
  //     "Etapas de venta claras, de la cotización al cierre",
  //     "Recordatorios de seguimiento por WhatsApp o correo",
  //     "Reportes de ventas por vendedor"
  //   ],
  //   "idealFor": "tu equipo de ventas lleva los clientes en libretas o en el teléfono de cada vendedor.",
  //   "photo": "1552664730-d307ca884978",
  //   "group": "sistemas",
  //   "featuredOnHome": false
  // },
  // {
  //   "id": "hosting",
  //   "icon": "i-cloud",
  //   "title": "Hosting en la nube",
  //   "subtitle": "Tu sistema siempre disponible",
  //   "summary": "Alojamos tu sistema en servidores seguros, con copias de respaldo y monitoreo, sin que tengas que comprar equipos.",
  //   "intro": "Tu sistema y tu página funcionando en servidores seguros, disponibles desde cualquier lugar y sin comprar equipos.",
  //   "includes": [
  //     "Alojamiento seguro con certificado SSL",
  //     "Copias de respaldo automáticas",
  //     "Monitoreo para detectar fallas antes que tus clientes",
  //     "Dominio y correos con el nombre de tu empresa"
  //   ],
  //   "idealFor": "quieres que tu sistema esté siempre disponible sin preocuparte por servidores.",
  //   "photo": "1558494949-ef010cbdcc31",
  //   "group": "sistemas",
  //   "featuredOnHome": false
  // },
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
    "photo": "/assets/img/servicios/paginas",
    "photoAlt": "Página web que se adapta a monitor, tablet y teléfono",
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
    "photo": "/assets/img/servicios/tiendas",
    "photoAlt": "Tienda en línea abierta en una tablet junto a tarjetas de pago",
    "group": "presencia",
    "featuredOnHome": true
  },
  {
    "id": "sistemas",
    "icon": "i-code",
    "title": "Desarrollo Personalizado",
    "subtitle": "El programa exacto para la forma en que trabajas",
    "summary": "Desarrollamos sistemas web y aplicaciones desde cero para automatizar tus cobros, inventario, clientes o cualquier proceso único de tu negocio.",
    "intro": "No obligues a tu empresa a adaptarse a un programa genérico. Creamos un sistema pensado exactamente para tus reglas, tu equipo y tu forma de trabajar.",
    "includes": [
      "Control de inventario, ventas, cobranza, citas o procesos internos",
      "Acceso seguro desde cualquier computadora, tablet o teléfono",
      "Automatización de recibos, reportes y avisos por WhatsApp o correo",
      "Paneles claros con la información de tu negocio en tiempo real"
    ],
    "idealFor": "llevas el control en hojas de cálculo o ningún programa comercial se adapta a lo que hace tu empresa.",
    "photo": "/assets/img/servicios/sistemas",
    "photoAlt": "Laptop con el código de un sistema a la medida en pantalla",
    "group": "sistemas",
    "featuredOnHome": true
  },
  {
    "id": "soporte",
    "icon": "i-headset",
    "title": "Soporte Técnico Remoto",
    "subtitle": "Soluciones rápidas en tu computadora sin importar dónde estés",
    "summary": "Nos conectamos a tus equipos a distancia para instalar programas, activar licencias, limpiar el sistema y dejar tu computadora trabajando rápido.",
    "intro": "Olvídate de llevar tu computadora a un taller o esperar días por un técnico. Nos conectamos de forma segura a tu equipo y resolvemos el problema en minutos.",
    "includes": [
      "Instalación y configuración de programas para tu trabajo",
      "Activación de licencias y actualizaciones de software",
      "Limpieza profunda y optimización para acelerar el sistema operativo",
      "Solución de errores de Windows, virus y configuración de dispositivos"
    ],
    "idealFor": "necesitas que las computadoras de tu negocio o estudio funcionen al 100% sin perder tiempo en traslados.",
    "photo": "/assets/img/servicios/soporte",
    "photoAlt": "Técnico de soporte atendiendo una llamada frente a su computadora",
    "group": "presencia",
    "featuredOnHome": false
  },
  {
    "id": "sistemas-administrativos",
    "icon": "i-mrp",
    "title": "Sistemas Administrativos",
    "subtitle": "Soporte certificado en a2 Softway, Saint y GeniusNet",
    "summary": "Instalación, licencias, mantenimiento de bases de datos y soporte especializado para que tu facturación e inventario nunca se detengan.",
    "intro": "Contamos con certificación para implementar y dar soporte a a2 Softway, Saint y GeniusNet. Resolvemos fallas críticas y optimizamos tu sistema para que trabaje sin errores.",
    "includes": [
      "Instalación en servidores y estaciones de trabajo, licencias y actualizaciones",
      "Reparación de bases de datos dañadas y solución de errores del sistema",
      "Ajuste de formatos de facturación, reportes, retenciones e impresoras fiscales",
      "Asistencia remota inmediata o presencial cuando tu operación lo necesite"
    ],
    "idealFor": "trabajas con a2, Saint o GeniusNet (o quieres implementarlos) y necesitas un equipo certificado que responda rápido cuando la facturación o el sistema fallan.",
    "photo": "/assets/img/servicios/sistemas-administrativos",
    "photoAlt": "Documentos contables, facturas y calculadora sobre un escritorio",
    "group": "sistemas",
    "featuredOnHome": false
  },
  {
    "id": "mantenimiento",
    "icon": "i-tools",
    "title": "Mantenimiento de equipos",
    "subtitle": "Mantén tus equipos en forma",
    "summary": "Revisamos y mantenemos tus computadoras, laptops y consolas de juego para que funcionen sin problemas y duren más tiempo.",
    "intro": "Tus equipos necesitan cuidados para funcionar bien y durar más tiempo. Nos encargamos de su mantenimiento y reparación.",
    "includes": [
      "Revisión y limpieza de computadoras, laptops y consolas",
      "Formateo y reinstalación de sistemas operativos",
      "Reparación de hardware y reemplazo de piezas",
      "Revisión y mantenimiento preventivo periódico"
    ],
    "idealFor": "tus equipos se calientan, se ponen lentos o se dañan con frecuencia y quieres que duren más tiempo.",
    "photo": "/assets/img/servicios/mantenimiento",
    "photoAlt": "Manos reparando la tarjeta de un equipo con un destornillador",
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
    "photo": "/assets/img/servicios/redes",
    "photoAlt": "Panel de red con cables azules conectados",
    "group": "presencia",
    "featuredOnHome": false
  },
  {
    "id": "cursos-programacion",
    "icon": "i-code",
    "title": "Adiestramiento y Cursos de Programación",
    "subtitle": "Capacitación competitiva en tecnologías de alta demanda",
    "summary": "Formamos a futuros programadores y equipos de trabajo en lenguajes modernos y frameworks actuales, con enfoque práctico y certificado.",
    "intro": "Lleva tus habilidades o las de tu equipo al siguiente nivel con cursos especializados en desarrollo de software, dictados por profesionales con experiencia real en la industria.",
    "includes": [
      "Clases prácticas en Java, Python, PHP y bases de datos",
      "Desarrollo web moderno con frameworks actuales (frontend y backend)",
      "Enfoque 100% práctico basado en proyectos reales del mercado",
      "Certificado de participación avalado al completar el programa"
    ],
    "idealFor": "quieres aprender a programar desde cero, subir de nivel profesional o capacitar al personal técnico de tu empresa.",
    "photo": "/assets/img/servicios/cursos",
    "photoAlt": "Programador escribiendo código en un monitor con múltiples pantallas",
    "group": "presencia",
    "featuredOnHome": false
  },
  {
    "id": "redes-sociales",
    "icon": "i-users",
    "title": "Manejo de Redes Sociales",
    "subtitle": "Impulsa tu marca en Instagram y TikTok",
    "summary": "Creamos contenido visual, videos, reels y publicaciones estratégicas para conectar con tus clientes y hacer crecer tu negocio en internet.",
    "intro": "No basta con tener redes sociales, hay que saber moverlas. Nos encargamos de la estrategia, el contenido y la constancia para que tu marca destaque en Instagram y TikTok.",
    "includes": [
      "Diseño de publicaciones atractivas y alineadas con tu marca",
      "Producción, edición y estrategia de videos, reels y TikToks",
      "Planificación y calendario mensual de contenido",
      "Gestión y redacción de copys orientados a ventas y atracción"
    ],
    "idealFor": "no tienes tiempo para subir contenido constante a tus redes o quieres que tu negocio se vea más profesional en internet.",
    "photo": "/assets/img/servicios/redes-sociales",
    "photoAlt": "Teléfono inteligente mostrando redes sociales y contenido digital",
    "group": "presencia",
    "featuredOnHome": false
  },
];
