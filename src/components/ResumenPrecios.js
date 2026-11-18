import { Table } from 'react-bootstrap';
import { formatearPrecio } from '../utils/validaciones';

function ResumenPrecios({ resumen }) {
  return (
    <Table variant="dark" className="ms-auto text-end" style={{ maxWidth: '360px' }}>
      <tbody>
        <tr><td>Subtotal (neto)</td><td>{formatearPrecio(resumen.subtotal)}</td></tr>
        {resumen.descuento > 0 && (
          <tr><td>Descuento Duoc</td><td>-{formatearPrecio(resumen.descuento)}</td></tr>
        )}
        <tr><td>IVA (19%)</td><td>{formatearPrecio(resumen.iva)}</td></tr>
        <tr className="fw-bold fs-5"><td>Total</td><td data-testid="total-pedido">{formatearPrecio(resumen.total)}</td></tr>
      </tbody>
    </Table>
  );
}

export default ResumenPrecios;
