import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildMessage, countAnswered, emptyState, estimateSize, whatsappUrl } from '../src/scripts/modules/quote-logic.js';

const c = (value, label = value) => ({ value, label });

describe('countAnswered', () => {
  it('cuenta 0 con el estado vacío y tolera undefined', () => {
    assert.equal(countAnswered(emptyState()), 0);
    assert.equal(countAnswered(undefined), 0);
  });
  it('cuenta funciones solo si hay al menos una', () => {
    assert.equal(countAnswered({ ...emptyState(), tipo: c('pagina'), funciones: [] }), 1);
    assert.equal(countAnswered({ tipo: c('pagina'), usuarios: c('solo'), funciones: [c('pagos')], plazo: c('meses') }), 4);
  });
});

describe('estimateSize', () => {
  it('no estima sin saber qué necesita', () => {
    assert.equal(estimateSize({ ...emptyState(), usuarios: c('empresa') }), null);
  });
  it('una página para una persona es pequeña', () => {
    assert.equal(estimateSize({ ...emptyState(), tipo: c('pagina'), usuarios: c('solo') }).label, 'Pequeño');
  });
  it('una tienda con equipo y algunas funciones es mediana', () => {
    const size = estimateSize({ ...emptyState(), tipo: c('tienda'), usuarios: c('equipo'), funciones: [c('pagos'), c('inventario')] });
    assert.equal(size.label, 'Mediano');
    assert.equal(size.level, 2);
  });
  it('un sistema para toda la empresa con varias funciones es grande', () => {
    const size = estimateSize({ ...emptyState(), tipo: c('sistema'), usuarios: c('empresa'), funciones: [c('a'), c('b')] });
    assert.equal(size.label, 'Grande');
  });
  it('usa un peso intermedio para tipos desconocidos', () => {
    assert.equal(estimateSize({ ...emptyState(), tipo: c('otro') }).score, 2);
  });
});

describe('buildMessage', () => {
  it('incluye solo las respuestas dadas y el tamaño', () => {
    const msg = buildMessage({
      tipo: c('tienda', 'Tienda en línea'),
      usuarios: null,
      funciones: [c('pagos', 'Cobrar en línea'), c('inventario', 'Control de inventario')],
      plazo: c('urgente', 'Lo antes posible'),
    });
    assert.match(msg, /^Hola NETSOLCA/);
    assert.match(msg, /Necesito: Tienda en línea/);
    assert.match(msg, /Funciones: Cobrar en línea, Control de inventario/);
    assert.match(msg, /Para cuándo: Lo antes posible/);
    assert.match(msg, /Tamaño estimado: Mediano/);
    assert.doesNotMatch(msg, /Lo usará/);
  });
  it('con el estado vacío solo saluda', () => {
    assert.equal(buildMessage(emptyState()), 'Hola NETSOLCA, quiero cotizar un proyecto:');
  });
});

describe('whatsappUrl', () => {
  it('devuelve null sin número', () => {
    assert.equal(whatsappUrl('', 'hola'), null);
    assert.equal(whatsappUrl(undefined, 'hola'), null);
  });
  it('limpia el número y codifica el mensaje', () => {
    assert.equal(whatsappUrl('+58 (414) 000-0000', 'Hola, ¿qué tal?\nBien'), 'https://wa.me/584140000000?text=Hola%2C%20%C2%BFqu%C3%A9%20tal%3F%0ABien');
  });
});
