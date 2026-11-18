import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/validaciones';
import { calcularResumen } from '../utils/carrito';
import ResumenPrecios from '../components/ResumenPrecios';

function Carrito({ carrito, descuento, usuario, onCambiarCantidad, onEliminar, onVaciar }) {
  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h1>Carrito de compras</h1>
        <p className="text-secundario">Tu carrito está vacío.</p>
        <Button as={Link} to="/catalogo" className="btn-neon">Ir al catálogo</Button>
      </Container>
    );
  }

  const resumen = calcularResumen(carrito, descuento);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Carrito de compras</h1>

      <div className="table-responsive">
        <Table variant="dark" className="align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{formatearPrecio(item.precio)}</td>
                <td>
                  <Button size="sm" variant="outline-light" aria-label={`Disminuir ${item.nombre}`}
                    onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}>-</Button>
                  <span className="mx-2">{item.cantidad}</span>
                  <Button size="sm" variant="outline-light" aria-label={`Aumentar ${item.nombre}`}
                    disabled={item.cantidad >= item.stock}
                    onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}>+</Button>
                </td>
                <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                <td>
                  <Button size="sm" variant="danger" onClick={() => onEliminar(item.id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {descuento > 0 && (
        <Alert variant="info">Descuento Duoc UC aplicado: {descuento * 100}%</Alert>
      )}
      <ResumenPrecios resumen={resumen} />

      <div className="text-end mt-3">
        <Button variant="outline-light" className="me-2" onClick={onVaciar}>Vaciar carrito</Button>
        {usuario ? (
          <Button as={Link} to="/checkout" className="btn-neon">Ir a pagar</Button>
        ) : (
          <Button as={Link} to="/login" className="btn-neon">Inicia sesión para comprar</Button>
        )}
      </div>
      {!usuario && (
        <p className="text-end text-secundario mt-2 mb-0">
          Al iniciar sesión se inicia un carrito nuevo.
        </p>
      )}
    </Container>
  );
}

export default Carrito;
