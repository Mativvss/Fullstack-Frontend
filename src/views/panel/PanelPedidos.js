import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/validaciones';
import { COMPRA_EXITOSA } from '../../utils/pedidos';
import { listarPedidos } from '../../api/api';
import { useCarga } from '../../hooks/useCarga';

function PanelPedidos() {
  const { datos, error, cargando } = useCarga(listarPedidos);
  const pedidos = datos || [];
  return (
    <Container className="py-5">
      <h1 className="mb-4">Órdenes</h1>
      {error && <Alert variant="danger">{error.message}</Alert>}
      {cargando ? (
        <p className="text-secundario">Cargando órdenes...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-secundario">Aún no hay órdenes.</p>
      ) : (
        <div className="table-responsive">
          <Table variant="dark" className="align-middle">
            <thead>
              <tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {[...pedidos].reverse().map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>{new Date(p.fecha).toLocaleString('es-CL')}</td>
                  <td>{p.cliente.nombre}</td>
                  <td>{formatearPrecio(p.resumen.total)}</td>
                  <td><Badge bg={p.estado === COMPRA_EXITOSA ? 'success' : 'danger'}>{p.estado}</Badge></td>
                  <td className="text-end">
                    <Button as={Link} to={`/panel/pedidos/${p.id}`} size="sm" variant="outline-info">Ver detalle</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default PanelPedidos;
