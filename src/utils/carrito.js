export const IVA = 0.19;
export const DESCUENTO_DUOC = 0.2;

export function agregarAlCarrito(carrito, producto) {
  const existe = carrito.find((item) => item.id === producto.id);
  const enCarrito = existe ? existe.cantidad : 0;
  if (enCarrito >= producto.stock) return carrito;
  if (existe) {
    return carrito.map((item) =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + 1, stock: producto.stock } : item
    );
  }
  return [...carrito, { ...producto, cantidad: 1 }];
}

export function eliminarDelCarrito(carrito, id) {
  return carrito.filter((item) => item.id !== id);
}

export function cambiarCantidad(carrito, id, cantidad) {
  if (cantidad <= 0) return eliminarDelCarrito(carrito, id);
  return carrito.map((item) =>
    item.id === id ? { ...item, cantidad: Math.min(cantidad, item.stock) } : item
  );
}

export function contarProductos(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

export function calcularResumen(carrito, descuento = 0) {
  const subtotal = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  const montoDescuento = Math.round(subtotal * descuento);
  const base = subtotal - montoDescuento;
  const iva = Math.round(base * IVA);
  return { subtotal, descuento: montoDescuento, base, iva, total: base + iva };
}

export function calcularTotal(carrito, descuento = 0) {
  return calcularResumen(carrito, descuento).total;
}

export function productosSinStock(carrito, productos) {
  return carrito
    .filter((item) => {
      const actual = productos.find((p) => p.id === item.id);
      return !actual || item.cantidad > actual.stock;
    })
    .map((item) => item.nombre);
}
