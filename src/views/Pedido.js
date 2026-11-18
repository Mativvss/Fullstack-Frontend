import { Container, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { COMPRA_EXITOSA } from '../utils/pedidos';
import { obtenerPedido } from '../api/api';
import { useCarga } from '../hooks/useCarga';
import DetallePedido from '../components/DetallePedido';
import { useCallback } from 'react';

function Pedido() {
  const { id } = useParams();
  const cargarPedido = useCallback(() => obtenerPedido(id), [id]);
  const { datos: pedido, cargando } = useCarga(cargarPedido);

  if (cargando) {
    return <p className="text-center py-5">Cargando pedido...</p>;
  }

  if (!pedido) {
    return (
      <Container className="py-5 text-center">
        <h1>Pedido no encontrado</h1>
        <Button as={Link} to="/catalogo" className="btn-neon">Ir al catálogo</Button>
      </Container>
    );
  }

  const exitoso = pedido.estado === COMPRA_EXITOSA;

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      {exitoso ? (
        <Alert variant="success">
          <h1 className="fs-3">¡Pedido realizado!</h1>
          Tu compra fue exitosa. Número de pedido: <strong>#{pedido.id}</strong>.
        </Alert>
      ) : (
        <Alert variant="danger">
          <h1 className="fs-3">Compra fallida</h1>
          No se realizó el pago, por lo que no se te cobró nada. Tus productos siguen en el carrito.
        </Alert>
      )}
      <DetallePedido pedido={pedido} />
      <div className="mt-3">
        {exitoso
          ? <Button as={Link} to="/catalogo" className="btn-neon">Seguir comprando</Button>
          : <Button as={Link} to="/checkout" className="btn-neon">Reintentar pago</Button>}
      </div>
    </Container>
  );
}

export default Pedido;
