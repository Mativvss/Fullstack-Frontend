import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { instalarApiFalsa } from './testing/apiFalsa';
import { guardarSesion } from './utils/sesion';

describe('App (integración con API simulada)', () => {
  const crearRouter = (ruta) => ({ children }) => (
    <MemoryRouter initialEntries={[ruta]}>{children}</MemoryRouter>
  );

  const iniciarSesion = async (email, password) => {
    fireEvent.change(screen.getByLabelText('Correo electrónico'), { target: { value: email } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } });
    fireEvent.click(screen.getByText('Ingresar'));
    await screen.findByText('Cerrar sesión');
  };

  const escribir = (etiqueta, valor) =>
    fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  const contador = () => screen.getByTestId('contador-carrito').textContent;

  let api;

  beforeEach(() => {
    window.sessionStorage.clear();
    api = instalarApiFalsa();
  });

  it('al agregar un producto en el catálogo, sube el contador del carrito en el menú', async () => {
    render(<App Router={crearRouter('/catalogo')} />);
    expect(contador()).toBe('0');
    fireEvent.click((await screen.findAllByText('Agregar al carrito'))[0]);
    expect(contador()).toBe('1');
  });

  it('al iniciar sesión se borra el carrito que se armó sin estar logueado', async () => {
    render(<App Router={crearRouter('/catalogo')} />);
    fireEvent.click((await screen.findAllByText('Agregar al carrito'))[0]);
    expect(contador()).toBe('1');

    fireEvent.click(screen.getByText('Iniciar sesión'));
    await iniciarSesion('cliente@levelup.cl', 'cliente123');
    expect(contador()).toBe('0');
  });

  it('la sesión se mantiene al recargar la página (restaura al usuario desde el token guardado)', async () => {
    guardarSesion({ accessToken: 'access-cliente@levelup.cl', refreshToken: 'refresh-cliente@levelup.cl' });
    render(<App Router={crearRouter('/')} />);

    expect(await screen.findByText('Cliente Demo (cliente)')).toBeTruthy();
    expect(screen.getByText('Cerrar sesión')).toBeTruthy();
    expect(api.peticiones).toContain('GET /auth/me');
  });

  it('el vendedor solo ve Productos y Órdenes, sin tienda ni carrito', async () => {
    render(<App Router={crearRouter('/login')} />);
    await iniciarSesion('vendedor@levelup.cl', 'vendedor123');

    expect(screen.getByRole('link', { name: 'Productos' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Órdenes' })).toBeTruthy();
    expect(screen.queryByText('Catálogo')).toBeNull();
    expect(screen.queryByTestId('contador-carrito')).toBeNull();
    expect(screen.queryByText('Usuarios')).toBeNull();
  });

  const comprar = async (resultado) => {
    render(<App Router={crearRouter('/login')} />);
    await iniciarSesion('cliente@levelup.cl', 'cliente123');
    fireEvent.click(screen.getByText('Catálogo'));
    await screen.findAllByText('Agregar al carrito');
    fireEvent.change(screen.getByLabelText('Filtrar por categoría'), { target: { value: 'Consolas' } });
    fireEvent.click(screen.getByText('Agregar al carrito'));
    fireEvent.click(screen.getByText(/^Carrito/));
    fireEvent.click(screen.getByText('Ir a pagar'));

    escribir('Teléfono', '912345678');
    fireEvent.click(screen.getByLabelText('Retiro en tienda (Antonio Varas #666, Santiago)'));
    fireEvent.click(screen.getByText(resultado));
  };

  it('compra exitosa: muestra "Pedido realizado", vacía el carrito y descuenta el stock', async () => {
    await comprar('Pagar (pago exitoso)');
    expect(await screen.findByText('¡Pedido realizado!')).toBeTruthy();
    expect(screen.getByTestId('total-pedido').textContent).toBe('$654.488 CLP');
    expect(contador()).toBe('0');
    expect(api.productos.find((p) => p.id === 5).stock).toBe(4);

    fireEvent.click(screen.getByText('Seguir comprando'));
    fireEvent.change(await screen.findByLabelText('Filtrar por categoría'), { target: { value: 'Consolas' } });
    expect(await screen.findByText('Stock: 4')).toBeTruthy();
  });

  it('compra fallida: no cobra, no descuenta stock y conserva el carrito', async () => {
    await comprar('Simular pago rechazado');
    expect(await screen.findByRole('heading', { name: 'Compra fallida' })).toBeTruthy();
    expect(contador()).toBe('1');
    expect(api.productos.find((p) => p.id === 5).stock).toBe(5);
  });
});
