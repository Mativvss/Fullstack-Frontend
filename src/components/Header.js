import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { rolDe, ADMINISTRADOR, VENDEDOR, INVITADO } from '../utils/roles';

function Header({ cantidadCarrito, usuario, onLogout }) {
  const navigate = useNavigate();
  const rol = rolDe(usuario);
  const veTienda = rol !== VENDEDOR;
  const veCarrito = rol !== VENDEDOR;
  const vePanel = rol === ADMINISTRADOR || rol === VENDEDOR;

  const cerrarSesion = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Navbar bg="black" variant="dark" expand="lg" style={{ borderBottom: '2px solid #39FF14' }}>
      <Container>
        <Navbar.Brand as={Link} to={rol === VENDEDOR ? '/panel/productos' : '/'}>
          <img src="/assets/img/logo.jpg" alt="Logo Level-Up Gamer" height="40" className="me-2 rounded" />
          LEVEL-UP GAMER
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-lg-center">
            {veTienda && <Nav.Link as={Link} to="/">Inicio</Nav.Link>}
            {veTienda && <Nav.Link as={Link} to="/catalogo">Catálogo</Nav.Link>}
            {vePanel && <Nav.Link as={Link} to="/panel/productos">Productos</Nav.Link>}
            {vePanel && <Nav.Link as={Link} to="/panel/pedidos">Órdenes</Nav.Link>}
            {rol === ADMINISTRADOR && <Nav.Link as={Link} to="/panel/usuarios">Usuarios</Nav.Link>}
            {rol === INVITADO && <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>}
            {rol === INVITADO && <Nav.Link as={Link} to="/registro">Registrarse</Nav.Link>}
            {veCarrito && (
              <Nav.Link as={Link} to="/carrito">
                Carrito <Badge bg="success" data-testid="contador-carrito">{cantidadCarrito}</Badge>
              </Nav.Link>
            )}
            {usuario && (
              <>
                <span className="navbar-text ms-lg-3 me-2">{usuario.nombre} ({usuario.rol})</span>
                <Button size="sm" variant="outline-light" onClick={cerrarSesion}>Cerrar sesión</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
