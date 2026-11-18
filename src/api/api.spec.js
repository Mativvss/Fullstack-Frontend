import { pedir } from './api';
import { leerSesion, guardarSesion } from '../utils/sesion';

describe('api.js (sesión con tokens JWT)', () => {
  beforeEach(() => window.sessionStorage.clear());

  const json = (estado, cuerpo) =>
    new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'Content-Type': 'application/json' } });

  it('si el access token expira (401), renueva con el refresh token y repite la petición', async () => {
    guardarSesion({ accessToken: 'viejo', refreshToken: 'refresh-1' });
    const llamadas = [];
    spyOn(window, 'fetch').and.callFake(async (url, opciones) => {
      llamadas.push(url.replace(/^.*\/api/, '') + ' ' + ((opciones.headers || {}).Authorization || ''));
      if (url.endsWith('/auth/refresh')) {
        return json(200, { accessToken: 'nuevo', refreshToken: 'refresh-2', usuario: {} });
      }
      const autorizado = opciones.headers.Authorization === 'Bearer nuevo';
      return autorizado ? json(200, { ok: true }) : json(401, { mensaje: 'expirado' });
    });

    const resultado = await pedir('/pedidos');

    expect(resultado).toEqual({ ok: true });
    expect(llamadas).toEqual(['/pedidos Bearer viejo', '/auth/refresh ', '/pedidos Bearer nuevo']);
    expect(leerSesion()).toEqual({ accessToken: 'nuevo', refreshToken: 'refresh-2' });
  });

  it('si el refresh token también falla, borra la sesión y avisa que expiró', async () => {
    guardarSesion({ accessToken: 'viejo', refreshToken: 'malo' });
    const aviso = jasmine.createSpy('aviso');
    window.addEventListener('levelup:sesion-expirada', aviso);
    spyOn(window, 'fetch').and.callFake(async () => json(401, { mensaje: 'no' }));

    let error;
    try {
      await pedir('/pedidos');
    } catch (e) {
      error = e;
    }

    window.removeEventListener('levelup:sesion-expirada', aviso);
    expect(error.estado).toBe(401);
    expect(leerSesion()).toBeNull();
    expect(aviso).toHaveBeenCalledTimes(1);
  });
});
