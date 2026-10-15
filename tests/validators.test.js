import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FIELD_NAMES,
  MESSAGE_MAX,
  MESSAGE_MIN,
  validateAll,
  validateField,
} from '../src/scripts/modules/validators.js';

const VALID = Object.freeze({
  nombre: 'María José Pérez',
  empresa: 'Distribuidora Ávila',
  correo: 'maria@empresa.com.ve',
  telefono: '+58 (412) 555-0101',
  servicio: 'ciberseguridad',
  mensaje: 'Necesitamos segmentar la red de nuestras dos sedes.',
});

describe('validateField: nombre', () => {
  it('acepta nombres con tildes, ñ y apóstrofos', () => {
    assert.equal(validateField('nombre', 'Begoña Núñez'), '');
    assert.equal(validateField('nombre', "D'Angelo Ruiz"), '');
  });
  it('rechaza vacío, muy corto o con números', () => {
    assert.match(validateField('nombre', '   '), /Escribe tu nombre/);
    assert.match(validateField('nombre', 'Jo'), /al menos 3/);
    assert.match(validateField('nombre', 'Jo3l'), /solo letras/);
  });
});

describe('validateField: empresa', () => {
  it('exige al menos 2 caracteres', () => {
    assert.match(validateField('empresa', ''), /nombre de tu empresa/);
    assert.match(validateField('empresa', 'A'), /demasiado corto/);
    assert.equal(validateField('empresa', 'TI'), '');
  });
});

describe('validateField: correo', () => {
  it('acepta correos válidos', () => {
    assert.equal(validateField('correo', 'ana@empresa.com'), '');
    assert.equal(validateField('correo', ' ana.ruiz+ventas@sub.empresa.com.ve '), '');
  });
  it('rechaza correos mal formados', () => {
    assert.match(validateField('correo', ''), /Escribe tu correo/);
    assert.match(validateField('correo', 'ana@empresa'), /correo válido/);
    assert.match(validateField('correo', 'ana empresa.com'), /correo válido/);
    assert.match(validateField('correo', 'ana@empresa.c'), /correo válido/);
  });
});

describe('validateField: telefono', () => {
  it('acepta formatos locales e internacionales de 10 a 15 dígitos', () => {
    assert.equal(validateField('telefono', '0414 555 0102'), '');
    assert.equal(validateField('telefono', '+58 (412) 555-0101'), '');
    assert.equal(validateField('telefono', '+584125550101'), '');
  });
  it('rechaza números cortos, largos o con letras', () => {
    assert.match(validateField('telefono', ''), /Escribe un número/);
    assert.match(validateField('telefono', '12345'), /teléfono válido/);
    assert.match(validateField('telefono', '1234567890123456'), /teléfono válido/);
    assert.match(validateField('telefono', '0414-CALL-NOW'), /teléfono válido/);
  });
});

describe('validateField: servicio', () => {
  it('exige una opción seleccionada', () => {
    assert.match(validateField('servicio', ''), /Selecciona/);
    assert.equal(validateField('servicio', 'redes'), '');
  });
});

describe('validateField: mensaje', () => {
  it(`exige entre ${MESSAGE_MIN} y ${MESSAGE_MAX} caracteres`, () => {
    assert.match(validateField('mensaje', ''), /Cuéntanos/);
    assert.match(validateField('mensaje', 'Hola'), /mínimo 20/);
    assert.equal(validateField('mensaje', 'a'.repeat(MESSAGE_MIN)), '');
    assert.equal(validateField('mensaje', 'a'.repeat(MESSAGE_MAX)), '');
    assert.match(validateField('mensaje', 'a'.repeat(MESSAGE_MAX + 1)), /supera/);
  });
  it('ignora espacios al principio y al final', () => {
    assert.match(validateField('mensaje', `   ${'a'.repeat(MESSAGE_MIN - 1)}   `), /mínimo/);
  });
});

describe('validateField: casos límite', () => {
  it('trata null/undefined como vacío y campos desconocidos como válidos', () => {
    assert.match(validateField('correo', null), /Escribe tu correo/);
    assert.match(validateField('nombre', undefined), /Escribe tu nombre/);
    assert.equal(validateField('campo-inexistente', 'x'), '');
  });
});

describe('validateAll', () => {
  it('no devuelve errores con datos válidos', () => {
    assert.deepEqual(validateAll(VALID), {});
  });
  it('devuelve solo los campos con error', () => {
    const errors = validateAll({ ...VALID, correo: 'mal', telefono: '' });
    assert.deepEqual(Object.keys(errors).sort(), ['correo', 'telefono']);
  });
  it('marca todos los campos cuando no hay datos', () => {
    assert.deepEqual(Object.keys(validateAll({})), [...FIELD_NAMES]);
    assert.deepEqual(Object.keys(validateAll(undefined)), [...FIELD_NAMES]);
  });
  it('no modifica el objeto de entrada', () => {
    const input = { ...VALID };
    validateAll(input);
    assert.deepEqual(input, VALID);
  });
});
