import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { validarCheckout } from '../utils/validaciones';
import { calcularResumen, productosSinStock } from '../utils/carrito';
import ResumenPrecios from '../components/ResumenPrecios';

function Checkout({ carrito, productos, descuento, usuario, onPagar }) {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    nombre: usuario.nombre, email: usuario.email, telefono: '',
    entrega: 'domicilio', direccion: '', comuna: '',
  });
  const [errores, setErrores] = useState({});
  const [errorStock, setErrorStock] = useState('');

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h1>Finalizar compra</h1>
        <p className="text-secundario">No tienes productos en el carrito.</p>
        <Button as={Link} to="/catalogo" className="btn-neon">Ir al catálogo</Button>
      </Container>
    );
  }

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const pagar = async (pagoExitoso) => {
    const nuevosErrores = validarCheckout(datos);
    setErrores(nuevosErrores);
    setErrorStock('');
    if (Object.keys(nuevosErrores).length > 0) return;

    const sinStock = productosSinStock(carrito, productos);
    if (sinStock.length > 0) {
      setErrorStock(`No hay stock suficiente de: ${sinStock.join(', ')}. Ajusta tu carrito.`);
      return;
    }
    try {
      const idPedido = await onPagar(datos, pagoExitoso);
      navigate(`/pedido/${idPedido}`);
    } catch (error) {
      if (error.errores && Object.keys(error.errores).length > 0) setErrores(error.errores);
      setErrorStock(error.message);
    }
  };

  const resumen = calcularResumen(carrito, descuento);

  return (
    <Container className="py-5">
      <h1 className="mb-4">Finalizar compra</h1>
      {errorStock && <Alert variant="danger">{errorStock} <Link to="/carrito">Volver al carrito</Link></Alert>}

      <Row>
        <Col xs={12} lg={7} className="mb-4">
          <Form noValidate onSubmit={(e) => e.preventDefault()} className="p-4 rounded card-gamer">
            <h2 className="fs-4 mb-3">Datos personales</h2>
            <Form.Group className="mb-3" controlId="co-nombre">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control name="nombre" value={datos.nombre} onChange={handleChange} />
              {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="co-email">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control type="email" name="email" value={datos.email} onChange={handleChange} />
              {errores.email && <small className="text-danger">{errores.email}</small>}
            </Form.Group>
            <Form.Group className="mb-4" controlId="co-telefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" value={datos.telefono} onChange={handleChange} placeholder="912345678" />
              {errores.telefono && <small className="text-danger">{errores.telefono}</small>}
            </Form.Group>

            <h2 className="fs-4 mb-3">Entrega</h2>
            <Form.Check type="radio" id="co-domicilio" name="entrega" value="domicilio" className="mb-1"
              label="Despacho a domicilio" checked={datos.entrega === 'domicilio'} onChange={handleChange} />
            <Form.Check type="radio" id="co-retiro" name="entrega" value="retiro" className="mb-3"
              label="Retiro en tienda (Antonio Varas #666, Santiago)" checked={datos.entrega === 'retiro'}
              onChange={handleChange} />

            {datos.entrega === 'domicilio' && (
              <>
                <Form.Group className="mb-3" controlId="co-direccion">
                  <Form.Label>Dirección de entrega</Form.Label>
                  <Form.Control name="direccion" value={datos.direccion} onChange={handleChange} />
                  {errores.direccion && <small className="text-danger">{errores.direccion}</small>}
                </Form.Group>
                <Form.Group className="mb-3" controlId="co-comuna">
                  <Form.Label>Comuna</Form.Label>
                  <Form.Control name="comuna" value={datos.comuna} onChange={handleChange} />
                  {errores.comuna && <small className="text-danger">{errores.comuna}</small>}
                </Form.Group>
              </>
            )}
          </Form>
        </Col>

        <Col xs={12} lg={5}>
          <div className="p-4 rounded card-gamer">
            <h2 className="fs-4 mb-3">Tu pedido</h2>
            <ul className="list-unstyled">
              {carrito.map((item) => (
                <li key={item.id}>{item.cantidad} x {item.nombre}</li>
              ))}
            </ul>
            <ResumenPrecios resumen={resumen} />
            <p className="text-secundario small">
              Simulación de pago: elige cómo termina la compra.
            </p>
            <Button className="btn-neon w-100 mb-2" onClick={() => pagar(true)}>Pagar (pago exitoso)</Button>
            <Button variant="outline-danger" className="w-100" onClick={() => pagar(false)}>
              Simular pago rechazado
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
