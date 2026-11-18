import { Container, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useCallback } from 'react';
import DetallePedido from '../../components/DetallePedido';
import { obtenerPedido } from '../../api/api';
import { useCarga } from '../../hooks/useCarga';

function PanelPedidoDetalle() {
  const { id } = useParams();
  const cargarPedido = useCallback(() => obtenerPedido(id), [id]);
  const { datos: pedido, cargando } = useCarga(cargarPedido);

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      {cargando ? <p>Cargando orden...</p> : pedido ? <DetallePedido pedido={pedido} /> : <h1>Orden no encontrada</h1>}
      <Button as={Link} to="/panel/pedidos" variant="outline-light" className="mt-3">Volver a órdenes</Button>
    </Container>
  );
}

export default PanelPedidoDetalle;
