/**
 * Proyectos de NETSOLCA. Alimenta el inicio (los 3 primeros) y /proyectos.
 * PLACEHOLDER: reemplazar por casos reales (cliente, resultados y fotos).
 * Para agregar un proyecto, añade un objeto a la lista: la página se genera sola.
 */
export interface Project {
  id: string;
  sector: string;
  title: string;
  client: string;
  problem: string;
  solution: string[];
  status?: "En desarrollo" | "En producción" | "Finalizado";
  results: string;
  /** Id de la foto en Unsplash, o una ruta propia que empiece por "/" (ej. /assets/img/proyectos/x.jpg) */
  photo: string;
  alt: string;
}

export const projects: Project[] = [
  // {
  //   "id": "inventario",
  //   "sector": "Distribución",
  //   "title": "Inventario y ventas en un solo sistema",
  //   "client": "[Nombre de la empresa] · Distribución",
  //   "problem": "Llevaban el inventario en hojas de cálculo y las ventas en otro programa. Nunca sabían con certeza cuánta mercancía tenían.",
  //   "solution": [
  //     "Un sistema web con entradas, salidas y existencias al día",
  //     "Ventas que descuentan el inventario solas",
  //     "Alertas cuando un producto se está acabando"
  //   ],
  //   "results": "[Agregar aquí los resultados del proyecto: tiempo ahorrado, ventas, errores evitados…]",
  //   "photo": "1553413077-190dd305871c",
  //   "alt": "Almacén con estanterías llenas de mercancía"
  // },
  // {
  //   "id": "tienda",
  //   "sector": "Comercio",
  //   "title": "Tienda en línea con pagos y pedidos",
  //   "client": "[Nombre de la empresa] · Comercio",
  //   "problem": "Vendían solo por redes sociales y perdían pedidos entre tantos mensajes.",
  //   "solution": [
  //     "Catálogo con fotos, precios y existencias",
  //     "Pagos en línea y aviso de cada pedido por WhatsApp",
  //     "Panel para seguir cada pedido hasta la entrega"
  //   ],
  //   "results": "[Agregar aquí los resultados del proyecto: tiempo ahorrado, ventas, errores evitados…]",
  //   "photo": "1607082348824-0a96f2a4b9da",
  //   "alt": "Bolsas de compra de colores sobre fondo oscuro"
  // },
  // {
  //   "id": "citas",
  //   "sector": "Salud",
  //   "title": "Agenda de citas para un centro médico",
  //   "client": "[Nombre de la empresa] · Salud",
  //   "problem": "Las citas se anotaban a mano y había pacientes que se cruzaban o no asistían.",
  //   "solution": [
  //     "Agenda en línea por médico y especialidad",
  //     "Recordatorios automáticos por WhatsApp",
  //     "Historial de cada paciente en un solo lugar"
  //   ],
  //   "results": "[Agregar aquí los resultados del proyecto: tiempo ahorrado, ventas, errores evitados…]",
  //   "photo": "1576091160550-2173dba999ef",
  //   "alt": "Persona escribiendo en un portátil junto a un estetoscopio"
  // },
  // {
  //   "id": "reportes",
  //   "sector": "Servicios",
  //   "title": "Panel de reportes para la gerencia",
  //   "client": "[Nombre de la empresa] · Servicios",
  //   "problem": "Armar el informe del mes tomaba días porque la información estaba dispersa.",
  //   "solution": [
  //     "Un panel que reúne los datos de toda la empresa",
  //     "Gráficas claras, actualizadas en tiempo real",
  //     "Reportes que se descargan con un clic"
  //   ],
  //   "results": "[Agregar aquí los resultados del proyecto: tiempo ahorrado, ventas, errores evitados…]",
  //   "photo": "1460925895917-afdab827c52f",
  //   "alt": "Portátil mostrando un panel con gráficas"
  // },
  // {
  //   "id": "cobros",
  //   "sector": "Comercio",
  //   "title": "Caja y cobros conectados al inventario",
  //   "client": "[Nombre de la empresa] · Comercio",
  //   "problem": "Al cerrar la caja, las cuentas no cuadraban con lo que había en el depósito.",
  //   "solution": [
  //     "Caja rápida que funciona desde una tablet",
  //     "Cada cobro actualiza el inventario al instante",
  //     "Cierre de caja diario en minutos"
  //   ],
  //   "results": "[Agregar aquí los resultados del proyecto: tiempo ahorrado, ventas, errores evitados…]",
  //   "photo": "1556742049-0cfed4f6a45d",
  //   "alt": "Cliente pagando con el teléfono en el mostrador de una tienda"
  // },
  // {
  //   "id": "web",
  //   "sector": "Industria",
  //   "title": "Página web para una empresa industrial",
  //   "client": "[Nombre de la empresa] · Industria",
  //   "problem": "Sus clientes no los encontraban en internet y la información de sus productos estaba en PDF.",
  //   "solution": [
  //     "Página rápida y fácil de ver en el celular",
  //     "Catálogo de productos con fichas técnicas",
  //     "Botón de WhatsApp y formulario de cotización"
  //   ],
  //   "results": "[Agregar aquí los resultados del proyecto: tiempo ahorrado, ventas, errores evitados…]",
  //   "photo": "1559526324-4b87b5e36e44",
  //   "alt": "Portátil mostrando una página web corporativa"
  // },
  {
      "id": "grados-de-venezuela",
      "sector": "Educación y Servicios",
      "title": "Sistema de gestión para actos de grado y cobros",
      "client": "Grados de Venezuela · Servicios",
      "status": "En producción",
      "problem": "Llevar el control de pagos por cuotas y la venta de anillos en papeles o Excel causaba errores y retrasos.",
      "solution": [
        "Control de contratos de grado y pagos fraccionados",
        "Inventario y seguimiento de pedidos de anillos",
        "Envío automático de recibos digitales por correo"
      ],
      "results": "Automatización total de la cobranza y entrega inmediata de comprobantes a cada estudiante.",
      "photo": "/assets/img/proyectos/grados.jpg",
      "alt": "Birrete y documentos de graduación sobre una mesa"
    },
    { 
    "id": "catedra-gaitera",
    "sector": "Entretenimiento",
    "title": "Plataforma de entradas con app móvil de validación QR",
    "client": "Cátedra Gaitera · Espectáculos",
    "status": "En producción",
    "problem": "Vender entradas por redes sociales dificultaba verificar los pagos y controlar el acceso sin filas largas o fraudes en la puerta del evento.",
    "solution": [
      "Tienda web para la compra de entradas con envío automático de QR",
      "Panel de administración para gestión de usuarios y aprobación de pagos",
      "App móvil exclusiva para escanear y validar accesos en puerta de forma segura"
    ],
    "results": "Validación de entradas 100% digital desde dispositivos móviles, eliminando duplicados y agilizando el ingreso en la puerta.",
    "photo": "/assets/img/proyectos/catedra.jpg",
    "alt": "Persona escaneando un código QR con un teléfono en un evento"
  },
];
