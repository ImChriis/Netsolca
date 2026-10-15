/** Preguntas frecuentes del inicio. También generan el FAQPage de datos estructurados. */
export interface FaqItem { question: string; answer: string; }

export const faq: FaqItem[] = [
  {
    "question": "¿Cuánto cuesta un sistema web?",
    "answer": "Depende de lo que necesites. Usa el cotizador o escríbenos: te enviamos un presupuesto detallado y sin compromiso, para que sepas exactamente qué incluye."
  },
  {
    "question": "¿Cuánto tiempo tardan en hacerlo?",
    "answer": "Una página sencilla toma menos tiempo que un sistema completo. En el presupuesto te damos fechas claras para cada etapa."
  },
  {
    "question": "¿Necesito saber de tecnología?",
    "answer": "No. Tú nos cuentas cómo funciona tu negocio y nosotros nos encargamos del resto. Al final te enseñamos a usarlo paso a paso."
  },
  {
    "question": "¿Qué pasa si algo falla después?",
    "answer": "Te atendemos las 24 horas, todos los días. También hacemos mantenimiento y copias de seguridad para evitar problemas."
  },
  {
    "question": "¿Dónde están ubicados?",
    "answer": "Estamos en Maracaibo, Venezuela. Podemos reunirnos en persona o hacer todo por videollamada y WhatsApp."
  }
];
