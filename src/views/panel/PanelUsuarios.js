import { Container, Table, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { listarUsuarios, cambiarRol, eliminarUsuario } from '../../api/api';
import { useCarga } from '../../hooks/useCarga';
import { ADMINISTRADOR, VENDEDOR, CLIENTE } from '../../utils/roles';

function PanelUsuarios({ usuarioActual }) {
  const { datos, error, recargar } = useCarga(listarUsuarios);
  const [errorAccion, setErrorAccion] = useState('');
  const usuarios = datos || [];

  const ejecutar = async (accion) => {
    setErrorAccion('');
    try {
      await accion();
      await recargar();
    } catch (e) {
      setErrorAccion(e.message);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Usuarios</h1>
      {(error || errorAccion) && <Alert variant="danger">{errorAccion || error.message}</Alert>}
      <div className="table-responsive">
        <Table variant="dark" className="align-middle">
          <thead>
            <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th></th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const esYo = u.email === usuarioActual.email;
              return (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>
                    <Form.Select size="sm" aria-label={`Rol de ${u.email}`} value={u.rol} disabled={esYo}
                      onChange={(e) => ejecutar(() => cambiarRol(u.id, e.target.value))}>
                      <option value={ADMINISTRADOR}>Administrador</option>
                      <option value={VENDEDOR}>Vendedor</option>
                      <option value={CLIENTE}>Cliente</option>
                    </Form.Select>
                  </td>
                  <td className="text-end">
                    <Button size="sm" variant="danger" disabled={esYo} onClick={() => ejecutar(() => eliminarUsuario(u.id))}>Eliminar</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

export default PanelUsuarios;
