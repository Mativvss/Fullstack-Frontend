import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/validaciones';

function ProductCard({ producto, onAgregar }) {
  const agotado = producto.stock <= 0;
  return (
    <Card className="card-gamer text-white h-100">
      <Card.Img variant="top" src={producto.img} alt={producto.nombre} className="img-producto" />
      <Card.Body className="d-flex flex-column text-center">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text className="fs-5 mb-1">{formatearPrecio(producto.precio)}</Card.Text>
        <Card.Text>
          {agotado
            ? <Badge bg="danger">Agotado</Badge>
            : <Badge bg="secondary">Stock: {producto.stock}</Badge>}
        </Card.Text>
        <Button as={Link} to={`/producto/${producto.id}`} variant="outline-info" className="mb-2 mt-auto">
          Ver detalle
        </Button>
        <Button className="btn-neon" disabled={agotado} onClick={() => onAgregar(producto)}>
          {agotado ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
