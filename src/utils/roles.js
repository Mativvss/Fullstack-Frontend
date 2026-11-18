export const ADMINISTRADOR = 'administrador';
export const VENDEDOR = 'vendedor';
export const CLIENTE = 'cliente';
export const INVITADO = 'invitado';

export function rolDe(usuario) {
  return usuario ? usuario.rol : INVITADO;
}

export function rutaPorDefecto(rol) {
  if (rol === INVITADO) return '/login';
  if (rol === VENDEDOR) return '/panel/productos';
  return '/';
}
