import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildContactMessage } from '../src/scripts/modules/contact-message.js';

const data = {
  nombre: '  Ana Pérez ',
  empresa: 'Mi Tienda',
  correo: 'ana@correo.com',
  telefono: '0414 000 0000',
  mensaje: 'Quiero un sistema de inventario para dos sucursales.',
};

describe('buildContactMessage', () => {
  it('incluye todos los datos del formulario', () => {
    const text = buildContactMessage(data, 'Tienda en línea');
    assert.match(text, /\*Nombre:\* Ana Pérez/);
    assert.match(text, /\*Empresa:\* Mi Tienda/);
    assert.match(text, /\*Correo:\* ana@correo\.com/);
    assert.match(text, /\*Teléfono:\* 0414 000 0000/);
    assert.match(text, /\*Me interesa:\* Tienda en línea/);
    assert.ok(text.endsWith('Quiero un sistema de inventario para dos sucursales.'));
  });

  it('empieza con un saludo', () => {
    assert.ok(buildContactMessage(data, 'Otro').startsWith('Hola NETSOLCA'));
  });
});

