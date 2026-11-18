import { Table, Badge } from 'react-bootstrap';
import { formatearPrecio } from '../utils/validaciones';
import { COMPRA_EXITOSA } from '../utils/pedidos';
import ResumenPrecios from './ResumenPrecios';

function DetallePedido({ pedido }) {
  const exitoso = pedido.estado === COMPRA_EXITOSA;
  return (
    <div className="p-4 rounded card-gamer">
      <h2 className="fs-4">
        Pedido #{pedido.id} <Badge bg={exitoso ? 'success' : 'danger'}>{pedido.estado}</Badge>
      </h2>
      <p className="text-secundario">{new Date(pedido.fecha).toLocaleString('es-CL')}</p>
      <p className="mb-1"><strong>Cliente:</strong> {pedido.cliente.nombre} ({pedido.cliente.email})</p>
      <p className="mb-1"><strong>Teléfono:</strong> {pedido.cliente.telefono}</p>
      <p>
        <strong>Entrega:</strong>{' '}
        {pedido.entrega.tipo === 'retiro'
          ? 'Retiro en tienda (Antonio Varas #666, Santiago)'
          : `Despacho a ${pedido.entrega.direccion}, ${pedido.entrega.comuna}`}
      </p>
      <div className="table-responsive">
        <Table variant="dark" className="align-middle">
          <thead>
            <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
          </thead>
          <tbody>
            {pedido.items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{formatearPrecio(item.precio)}</td>
                <td>{item.cantidad}</td>
                <td>{formatearPrecio(item.precio * item.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ResumenPrecios resumen={pedido.resumen} />
    </div>
  );
}

export default DetallePedido;
