import { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formatearPrecio, validarProducto } from '../../utils/validaciones';
import { ADMINISTRADOR } from '../../utils/roles';

const VACIO = { nombre: '', categoria: '', precio: '', stock: '', descripcion: '' };

function PanelProductoDetalle({ productos, rol, onGuardar }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const esNuevo = id === 'nuevo';
  const existente = productos.find((p) => p.id === Number(id));
  const [datos, setDatos] = useState(esNuevo ? VACIO : existente);
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState('');

  if (!esNuevo && !existente) {
    return (
      <Container className="py-5 text-center">
        <h1>Producto no encontrado</h1>
        <Button as={Link} to="/panel/productos" className="btn-neon">Volver</Button>
      </Container>
    );
  }

  if (rol !== ADMINISTRADOR) {
    return (
      <Container className="py-5" style={{ maxWidth: '700px' }}>
        <h1>{existente.nombre}</h1>
        <p className="text-secundario">Categoría: {existente.categoria}</p>
        <p>{existente.descripcion}</p>
        <p className="fs-4">{formatearPrecio(existente.precio)}</p>
        <p>Stock: {existente.stock}</p>
        <Button as={Link} to="/panel/productos" variant="outline-light">Volver</Button>
      </Container>
    );
  }

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarProducto(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    try {
      await onGuardar({
        ...datos,
        precio: Number(datos.precio),
        stock: Number(datos.stock),
        img: datos.img || '/assets/img/logo.jpg',
      });
      navigate('/panel/productos');
    } catch (error) {
      setErrores(error.errores || {});
      setErrorServidor(error.message);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '700px' }}>
      <h1 className="mb-4">{esNuevo ? 'Nuevo producto' : `Editar: ${existente.nombre}`}</h1>
      {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}
      <Form noValidate onSubmit={handleSubmit} className="p-4 rounded card-gamer">
        <Form.Group className="mb-3" controlId="pr-nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="nombre" value={datos.nombre} onChange={handleChange} />
          {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="pr-categoria">
          <Form.Label>Categoría</Form.Label>
          <Form.Control name="categoria" value={datos.categoria} onChange={handleChange} />
          {errores.categoria && <small className="text-danger">{errores.categoria}</small>}
        </Form.Group>
        <Row>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="pr-precio">
              <Form.Label>Precio neto (CLP)</Form.Label>
              <Form.Control type="number" name="precio" value={datos.precio} onChange={handleChange} />
              {errores.precio && <small className="text-danger">{errores.precio}</small>}
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group className="mb-3" controlId="pr-stock">
              <Form.Label>Stock</Form.Label>
              <Form.Control type="number" name="stock" value={datos.stock} onChange={handleChange} />
              {errores.stock && <small className="text-danger">{errores.stock}</small>}
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-4" controlId="pr-descripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control as="textarea" rows={3} name="descripcion" value={datos.descripcion} onChange={handleChange} />
        </Form.Group>
        <Button type="submit" className="btn-neon me-2">Guardar</Button>
        <Button as={Link} to="/panel/productos" variant="outline-light">Cancelar</Button>
      </Form>
    </Container>
  );
}

export default PanelProductoDetalle;
