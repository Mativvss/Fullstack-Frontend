import { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { validarLogin } from '../utils/validaciones';

function Login({ onLogin }) {
  const [datos, setDatos] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState({});
  const [errorCredenciales, setErrorCredenciales] = useState('');

  const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validarLogin(datos);
    setErrores(nuevosErrores);
    setErrorCredenciales('');
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await onLogin(datos.email, datos.password);
    } catch (error) {
      setErrorCredenciales(
        error.estado === 401 ? 'Correo o contraseña incorrectos.' : error.message
      );
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Iniciar sesión</h1>
      {errorCredenciales && <Alert variant="danger">{errorCredenciales}</Alert>}

      <Form onSubmit={handleSubmit} noValidate className="p-4 rounded card-gamer">
        <Form.Group className="mb-3" controlId="login-email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" name="email" value={datos.email} onChange={handleChange} />
          {errores.email && <small className="text-danger">{errores.email}</small>}
        </Form.Group>

        <Form.Group className="mb-4" controlId="login-password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" value={datos.password} onChange={handleChange} />
          {errores.password && <small className="text-danger">{errores.password}</small>}
        </Form.Group>

        <Button type="submit" className="btn-neon w-100">Ingresar</Button>
      </Form>
    </Container>
  );
}

export default Login;
