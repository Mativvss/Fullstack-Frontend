
export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export function esCorreoDuoc(email) {
  return email.endsWith('@duoc.cl') || email.endsWith('@duocuc.cl');
}

export function validarRegistro({ nombre, email, fecha, password, confirmar }) {
  const errores = {};
  if (nombre.length < 2 || nombre.length > 100) {
    errores.nombre = 'El nombre debe tener entre 2 y 100 caracteres.';
  }
  if (!FORMATO_EMAIL.test(email)) {
    errores.email = 'Ingresa un correo válido.';
  }
  if (!fecha || calcularEdad(fecha) < 18) {
    errores.fecha = 'Debes tener 18 años o más.';
  }
  if (password.length < 6) {
    errores.password = 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (confirmar === '' || confirmar !== password) {
    errores.confirmar = 'Las contraseñas no coinciden.';
  }
  return errores;
}

export function validarLogin({ email, password }) {
  const errores = {};
  if (!FORMATO_EMAIL.test(email)) {
    errores.email = 'Ingresa un correo válido.';
  }
  if (password.length === 0) {
    errores.password = 'Ingresa tu contraseña.';
  }
  return errores;
}

export function validarCheckout({ nombre, email, telefono, entrega, direccion, comuna }) {
  const errores = {};
  if (nombre.trim().length < 2) {
    errores.nombre = 'Ingresa tu nombre completo.';
  }
  if (!FORMATO_EMAIL.test(email)) {
    errores.email = 'Ingresa un correo válido.';
  }
  if (!/^\d{9}$/.test(telefono.replace(/[\s+]|^56/g, ''))) {
    errores.telefono = 'Ingresa un teléfono de 9 dígitos (ej: 912345678).';
  }
  if (entrega === 'domicilio') {
    if (direccion.trim().length < 5) {
      errores.direccion = 'Ingresa la dirección de entrega.';
    }
    if (comuna.trim().length < 2) {
      errores.comuna = 'Ingresa la comuna.';
    }
  }
  return errores;
}

export function validarProducto({ nombre, categoria, precio, stock }) {
  const errores = {};
  if (nombre.trim().length < 2) {
    errores.nombre = 'Ingresa el nombre del producto.';
  }
  if (categoria.trim().length < 2) {
    errores.categoria = 'Ingresa la categoría.';
  }
  if (!Number.isInteger(Number(precio)) || Number(precio) <= 0) {
    errores.precio = 'El precio debe ser un número entero mayor a 0.';
  }
  if (stock === '' || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    errores.stock = 'El stock debe ser un número entero, 0 o mayor.';
  }
  return errores;
}

export function formatearPrecio(precio) {
  return '$' + Number(precio).toLocaleString('es-CL') + ' CLP';
}
