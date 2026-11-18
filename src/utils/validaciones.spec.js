import { calcularEdad, esCorreoDuoc, validarRegistro } from './validaciones';

describe('validaciones.js', () => {
  const registroValido = {
    nombre: 'Matías Franke',
    email: 'matias@gmail.com',
    fecha: '2000-01-15',
    password: 'clave123',
    confirmar: 'clave123',
  };

  it('calcula la edad según la fecha de nacimiento (con reloj falso)', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 9, 12));
    expect(calcularEdad('2000-01-15')).toBe(26);
    expect(calcularEdad('2000-12-25')).toBe(25);
    jasmine.clock().uninstall();
  });

  it('reconoce los correos Duoc (@duoc.cl y @duocuc.cl) y rechaza otros', () => {
    expect(esCorreoDuoc('ana@duoc.cl')).toBeTrue();
    expect(esCorreoDuoc('matias@duocuc.cl')).toBeTrue();
    expect(esCorreoDuoc('matias@gmail.com')).toBeFalse();
  });

  it('rechaza el registro de un menor de 18 años', () => {
    const fechaMenor = `${new Date().getFullYear() - 10}-01-01`;
    const errores = validarRegistro({ ...registroValido, fecha: fechaMenor });
    expect(errores.fecha).toBe('Debes tener 18 años o más.');
  });

  it('rechaza contraseñas que no coinciden', () => {
    const errores = validarRegistro({ ...registroValido, confirmar: 'otraclave' });
    expect(errores.confirmar).toBeDefined();
  });
});
