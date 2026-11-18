import { agregarAlCarrito, calcularResumen, productosSinStock } from './carrito';

describe('carrito.js', () => {
  const mouse = { id: 8, nombre: 'Mouse Logitech G502', precio: 49990, stock: 12 };
  const ps5 = { id: 5, nombre: 'PlayStation 5', precio: 549990, stock: 1 };

  it('agrega un producto nuevo y suma 1 a la cantidad si ya estaba en el carrito', () => {
    const unaVez = agregarAlCarrito([], mouse);
    expect(unaVez.length).toBe(1);
    expect(unaVez[0].cantidad).toBe(1);

    const dosVeces = agregarAlCarrito(unaVez, mouse);
    expect(dosVeces.length).toBe(1);
    expect(dosVeces[0].cantidad).toBe(2);
  });

  it('no permite agregar más unidades que el stock disponible', () => {
    const unaVez = agregarAlCarrito([], ps5);
    const intento = agregarAlCarrito(unaVez, ps5);
    expect(intento[0].cantidad).toBe(1);
    expect(agregarAlCarrito([], { ...ps5, stock: 0 }).length).toBe(0);
  });

  it('calcula subtotal, descuento Duoc del 20%, IVA del 19% y total', () => {
    const carrito = [{ ...mouse, cantidad: 2 }, { ...ps5, cantidad: 1 }];
    const sinDescuento = calcularResumen(carrito);
    expect(sinDescuento.subtotal).toBe(649970);
    expect(sinDescuento.iva).toBe(123494);
    expect(sinDescuento.total).toBe(773464);

    const conDescuento = calcularResumen(carrito, 0.2);
    expect(conDescuento.descuento).toBe(129994);
    expect(conDescuento.iva).toBe(98795);
    expect(conDescuento.total).toBe(618771);
  });

  it('detecta los productos del carrito que ya no tienen stock suficiente', () => {
    const carrito = [{ ...mouse, cantidad: 3 }, { ...ps5, cantidad: 1 }];
    const actuales = [{ ...mouse, stock: 2 }, ps5];
    expect(productosSinStock(carrito, actuales)).toEqual(['Mouse Logitech G502']);
  });
});
