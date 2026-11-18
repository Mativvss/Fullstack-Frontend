import { leerSesion, guardarSesion, borrarSesion } from '../utils/sesion';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
export const EVENTO_SESION_EXPIRADA = 'levelup:sesion-expirada';

export class ErrorApi extends Error {
  constructor(estado, mensaje, errores) {
    super(mensaje);
    this.estado = estado;
    this.errores = errores || {};
  }
}

let renovacionEnCurso = null;

async function enviar(ruta, { metodo = 'GET', cuerpo, token } = {}) {
  const cabeceras = {};
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json';
  if (token) cabeceras.Authorization = `Bearer ${token}`;
  try {
    return await fetch(API_URL + ruta, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch (error) {
    throw new ErrorApi(0, 'No se pudo conectar con el servidor.');
  }
}

async function leerRespuesta(respuesta) {
  if (respuesta.status === 204) return null;
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    throw new ErrorApi(respuesta.status, (datos && datos.mensaje) || 'Ocurrió un error.', datos && datos.errores);
  }
  return datos;
}

async function renovarSesion() {
  const sesion = leerSesion();
  if (!sesion) return false;
  if (!renovacionEnCurso) {
    renovacionEnCurso = (async () => {
      const respuesta = await enviar('/auth/refresh', {
        metodo: 'POST', cuerpo: { refreshToken: sesion.refreshToken },
      });
      if (!respuesta.ok) {
        borrarSesion();
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA));
        return false;
      }
      const datos = await respuesta.json();
      guardarSesion({ accessToken: datos.accessToken, refreshToken: datos.refreshToken });
      return true;
    })().finally(() => {
      renovacionEnCurso = null;
    });
  }
  return renovacionEnCurso;
}

export async function pedir(ruta, { metodo = 'GET', cuerpo, conToken = true } = {}) {
  const sesion = conToken ? leerSesion() : null;
  let respuesta = await enviar(ruta, { metodo, cuerpo, token: sesion && sesion.accessToken });
  if (respuesta.status === 401 && sesion && (await renovarSesion())) {
    respuesta = await enviar(ruta, { metodo, cuerpo, token: leerSesion().accessToken });
  }
  return leerRespuesta(respuesta);
}

export async function iniciarSesion(email, password) {
  const datos = await pedir('/auth/login', { metodo: 'POST', cuerpo: { email, password }, conToken: false });
  guardarSesion({ accessToken: datos.accessToken, refreshToken: datos.refreshToken });
  return datos.usuario;
}

export function cerrarSesion() {
  borrarSesion();
}

export function registrar(datos) {
  return pedir('/auth/register', { metodo: 'POST', cuerpo: datos, conToken: false });
}

export function obtenerUsuarioActual() {
  return pedir('/auth/me');
}

export function listarProductos() {
  return pedir('/productos', { conToken: false });
}

export function guardarProducto(producto) {
  return producto.id
    ? pedir(`/productos/${producto.id}`, { metodo: 'PUT', cuerpo: producto })
    : pedir('/productos', { metodo: 'POST', cuerpo: producto });
}

export function eliminarProducto(id) {
  return pedir(`/productos/${id}`, { metodo: 'DELETE' });
}

export function crearPedido(datos) {
  return pedir('/pedidos', { metodo: 'POST', cuerpo: datos });
}

export function listarPedidos() {
  return pedir('/pedidos');
}

export function obtenerPedido(id) {
  return pedir(`/pedidos/${id}`);
}

export function listarUsuarios() {
  return pedir('/usuarios');
}

export function cambiarRol(id, rol) {
  return pedir(`/usuarios/${id}/rol`, { metodo: 'PUT', cuerpo: { rol } });
}

export function eliminarUsuario(id) {
  return pedir(`/usuarios/${id}`, { metodo: 'DELETE' });
}
