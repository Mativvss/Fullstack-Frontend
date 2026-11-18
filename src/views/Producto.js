import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/validaciones';

function Producto({ productos, onAgregar }) {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === Number(id));

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h1>Producto no encontrado</h1>
        <Button as={Link} to="/catalogo" className="btn-neon">Volver al catálogo</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="align-items-center">
        <Col xs={12} md={6} className="mb-4 text-center">
          <img src={producto.img} alt={producto.nombre} className="img-fluid rounded" style={{ maxHeight: '400px', background: '#fff' }} />
        </Col>
        <Col xs={12} md={6}>
          <h1>{producto.nombre}</h1>
          <p className="text-secundario">Categoría: {producto.categoria}</p>
          <p>{producto.descripcion}</p>
          <p className="fs-3 mb-1">{formatearPrecio(producto.precio)} <small className="fs-6 text-secundario">+ IVA</small></p>
          <p>
            {producto.stock <= 0
              ? <Badge bg="danger">Agotado</Badge>
              : <Badge bg="secondary">Stock disponible: {producto.stock}</Badge>}
          </p>
          <Button className="btn-neon me-2" disabled={producto.stock <= 0} onClick={() => onAgregar(producto)}>
            {producto.stock <= 0 ? 'Sin stock' : 'Agregar al carrito'}
          </Button>
          <Button as={Link} to="/catalogo" variant="outline-light">Volver</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Producto;
