const CLAVE = 'levelup_sesion';

export function leerSesion() {
  try {
    const crudo = window.sessionStorage.getItem(CLAVE);
    return crudo ? JSON.parse(crudo) : null;
  } catch (error) {
    return null;
  }
}

export function guardarSesion(tokens) {
  try {
    window.sessionStorage.setItem(CLAVE, JSON.stringify(tokens));
  } catch (error) {
    return;
  }
}

export function borrarSesion() {
  try {
    window.sessionStorage.removeItem(CLAVE);
  } catch (error) {
    return;
  }
}
