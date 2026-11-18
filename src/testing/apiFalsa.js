import { productosPrueba } from './datosPrueba';
import { calcularResumen } from '../utils/carrito';
import { esCorreoDuoc } from '../utils/validaciones';

export const USUARIOS_PRUEBA = [
  { id: 1, nombre: 'Administrador Level-Up', email: 'admin@levelup.cl', password: 'admin123', rol: 'administrador' },
  { id: 2, nombre: 'Vendedor Level-Up', email: 'vendedor@levelup.cl', password: 'vendedor123', rol: 'vendedor' },
  { id: 3, nombre: 'Cliente Demo', email: 'cliente@levelup.cl', password: 'cliente123', rol: 'cliente' },
];

function respuesta(estado, cuerpo) {
  return new Response(cuerpo === null ? null : JSON.stringify(cuerpo), {
    status: estado,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function instalarApiFalsa() {
  const estado = {
    productos: productosPrueba.map((p) => ({ ...p })),
    pedidos: [],
    peticiones: [],
  };

  const publico = (u) => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol });
  const usuarioDe = (opciones) => {
    const cabecera = (opciones.headers || {}).Authorization || '';
    const email = cabecera.replace('Bearer access-', '');
    return USUARIOS_PRUEBA.find((u) => u.email === email) || null;
  };

  spyOn(window, 'fetch').and.callFake(async (url, opciones = {}) => {
    const ruta = url.replace(/^.*\/api/, '');
    const metodo = opciones.method || 'GET';
    const cuerpo = opciones.body ? JSON.parse(opciones.body) : null;
    estado.peticiones.push(`${metodo} ${ruta}`);

    if (metodo === 'POST' && ruta === '/auth/login') {
      const u = USUARIOS_PRUEBA.find((x) => x.email === cuerpo.email && x.password === cuerpo.password);
      if (!u) return respuesta(401, { mensaje: 'Correo o contraseña incorrectos.' });
      return respuesta(200, { accessToken: `access-${u.email}`, refreshToken: `refresh-${u.email}`, usuario: publico(u) });
    }
    if (metodo === 'GET' && ruta === '/productos') {
      return respuesta(200, estado.productos);
    }

    const usuario = usuarioDe(opciones);
    if (!usuario) return respuesta(401, { mensaje: 'Debes iniciar sesión para acceder' });

    if (metodo === 'GET' && ruta === '/auth/me') {
      return respuesta(200, publico(usuario));
    }
    if (metodo === 'POST' && ruta === '/pedidos') {
      const carrito = cuerpo.items.map((i) => ({
        ...estado.productos.find((p) => p.id === i.productoId), cantidad: i.cantidad,
      }));
      if (carrito.some((i) => i.cantidad > i.stock)) {
        return respuesta(409, { mensaje: 'Stock insuficiente.' });
      }
      if (cuerpo.pagoExitoso) {
        carrito.forEach((i) => {
          estado.productos.find((p) => p.id === i.id).stock -= i.cantidad;
        });
      }
      const pedido = {
        id: 1001 + estado.pedidos.length,
        fecha: new Date().toISOString(),
        estado: cuerpo.pagoExitoso ? 'Compra exitosa' : 'Compra fallida',
        usuarioEmail: usuario.email,
        cliente: { nombre: cuerpo.nombre, email: cuerpo.email, telefono: cuerpo.telefono },
        entrega: { tipo: cuerpo.entrega, direccion: cuerpo.direccion, comuna: cuerpo.comuna },
        items: carrito.map((i) => ({ id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
        resumen: calcularResumen(carrito, esCorreoDuoc(usuario.email) ? 0.2 : 0),
      };
      estado.pedidos.push(pedido);
      return respuesta(201, pedido);
    }
    const detalle = ruta.match(/^\/pedidos\/(\d+)$/);
    if (metodo === 'GET' && detalle) {
      const pedido = estado.pedidos.find((p) => p.id === Number(detalle[1]));
      return pedido ? respuesta(200, pedido) : respuesta(404, { mensaje: 'Pedido no encontrado' });
    }
    return respuesta(404, { mensaje: 'Ruta no simulada' });
  });

  return estado;
}
