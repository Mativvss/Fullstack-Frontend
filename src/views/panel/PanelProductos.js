import { useState } from 'react';
import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/validaciones';
import { ADMINISTRADOR } from '../../utils/roles';

function PanelProductos({ productos, rol, onEliminar }) {
  const esAdmin = rol === ADMINISTRADOR;
  const [error, setError] = useState('');

  const eliminar = async (id) => {
    setError('');
    try {
      await onEliminar(id);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Productos</h1>
        {esAdmin && <Button as={Link} to="/panel/productos/nuevo" className="btn-neon">Nuevo producto</Button>}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="table-responsive">
        <Table variant="dark" className="align-middle">
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>{p.stock <= 0 ? <Badge bg="danger">Agotado</Badge> : p.stock}</td>
                <td className="text-end">
                  <Button as={Link} to={`/panel/productos/${p.id}`} size="sm" variant="outline-info" className="me-2">
                    {esAdmin ? 'Ver / editar' : 'Ver detalle'}
                  </Button>
                  {esAdmin && (
                    <Button size="sm" variant="danger" onClick={() => eliminar(p.id)}>Eliminar</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default PanelProductos;
