import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { validarRegistro, esCorreoDuoc } from '../utils/validaciones';

const DATOS_VACIOS = { nombre: '', email: '', fecha: '', password: '', confirmar: '' };

function Registro({ onRegistro }) {
  const [datos, setDatos] = useState(DATOS_VACIOS);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);
  const [descuento, setDescuento] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarRegistro(datos);
    setErrores(nuevosErrores);
    setErrorServidor('');
    setExito(false);
    setDescuento(false);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await onRegistro({
        nombre: datos.nombre, email: datos.email, fecha: datos.fecha, password: datos.password,
      });
      setExito(true);
      setDescuento(esCorreoDuoc(datos.email));
      setDatos(DATOS_VACIOS);
    } catch (error) {
      if (error.estado === 409) {
        setErrores({ email: error.message });
      } else if (Object.keys(error.errores).length > 0) {
        setErrores(error.errores);
      } else {
        setErrorServidor(error.message);
      }
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Crear cuenta</h1>

      {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}
      {exito && (
        <Alert variant="success">
          ¡Cuenta creada con éxito! Ahora puedes <Link to="/login">iniciar sesión</Link>.
        </Alert>
      )}
      {descuento && <Alert variant="info">¡Tienes 20% de descuento de por vida por ser Duoc UC!</Alert>}

      <Form onSubmit={handleSubmit} noValidate className="p-4 rounded card-gamer">
        <Form.Group className="mb-3" controlId="reg-nombre">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control type="text" name="nombre" value={datos.nombre} onChange={handleChange} />
          {errores.nombre && <small className="text-danger">{errores.nombre}</small>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="email" value={datos.email} onChange={handleChange} />
          {errores.email && <small className="text-danger">{errores.email}</small>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-fecha">
          <Form.Label>Fecha de nacimiento</Form.Label>
          <Form.Control type="date" name="fecha" value={datos.fecha} onChange={handleChange} />
          {errores.fecha && <small className="text-danger">{errores.fecha}</small>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="reg-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={datos.password} onChange={handleChange} />
          {errores.password && <small className="text-danger">{errores.password}</small>}
        </Form.Group>

        <Form.Group className="mb-4" controlId="reg-confirmar">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control type="password" name="confirmar" value={datos.confirmar} onChange={handleChange} />
          {errores.confirmar && <small className="text-danger">{errores.confirmar}</small>}
        </Form.Group>

        <Button type="submit" className="btn-neon w-100">Registrarse</Button>
      </Form>
    </Container>
  );
}

export default Registro;
