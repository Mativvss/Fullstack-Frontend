import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import RutaProtegida from './components/RutaProtegida';
import Inicio from './views/Inicio';
import Catalogo from './views/Catalogo';
import Producto from './views/Producto';
import Carrito from './views/Carrito';
import Checkout from './views/Checkout';
import Pedido from './views/Pedido';
import Login from './views/Login';
import Registro from './views/Registro';
import PanelProductos from './views/panel/PanelProductos';
import PanelProductoDetalle from './views/panel/PanelProductoDetalle';
import PanelPedidos from './views/panel/PanelPedidos';
import PanelPedidoDetalle from './views/panel/PanelPedidoDetalle';
import PanelUsuarios from './views/panel/PanelUsuarios';
import * as api from './api/api';
import { leerSesion } from './utils/sesion';
import { esCorreoDuoc } from './utils/validaciones';
import { ADMINISTRADOR, VENDEDOR, CLIENTE, INVITADO, rolDe } from './utils/roles';
import {
  agregarAlCarrito, eliminarDelCarrito, cambiarCantidad, contarProductos, DESCUENTO_DUOC,
} from './utils/carrito';

const SOLO_TIENDA = [INVITADO, CLIENTE, ADMINISTRADOR];
const COMPRADORES = [CLIENTE, ADMINISTRADOR];
const PERSONAL = [ADMINISTRADOR, VENDEDOR];

function App({ Router = BrowserRouter }) {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [verificandoSesion, setVerificandoSesion] = useState(() => leerSesion() !== null);
  const [errorCarga, setErrorCarga] = useState('');
  const [carrito, setCarrito] = useState([]);

  const recargarProductos = useCallback(async () => {
    try {
      setProductos(await api.listarProductos());
      setErrorCarga('');
    } catch (error) {
      setErrorCarga(error.message);
    }
  }, []);

  useEffect(() => {
    recargarProductos();
  }, [recargarProductos]);

  useEffect(() => {
    if (!leerSesion()) return;
    api.obtenerUsuarioActual()
      .then(setUsuario)
      .catch(() => api.cerrarSesion())
      .finally(() => setVerificandoSesion(false));
  }, []);

  useEffect(() => {
    const expirar = () => {
      setUsuario(null);
      setCarrito([]);
    };
    window.addEventListener(api.EVENTO_SESION_EXPIRADA, expirar);
    return () => window.removeEventListener(api.EVENTO_SESION_EXPIRADA, expirar);
  }, []);

  const rol = rolDe(usuario);
  const descuento = usuario && esCorreoDuoc(usuario.email) ? DESCUENTO_DUOC : 0;

  const onAgregar = (producto) => setCarrito((actual) => agregarAlCarrito(actual, producto));
  const onEliminar = (id) => setCarrito((actual) => eliminarDelCarrito(actual, id));
  const onCambiarCantidad = (id, cantidad) => setCarrito((actual) => cambiarCantidad(actual, id, cantidad));
  const onVaciar = () => setCarrito([]);

  const onLogin = async (email, password) => {
    const iniciado = await api.iniciarSesion(email, password);
    setCarrito([]);
    setUsuario(iniciado);
  };
  const onLogout = () => {
    api.cerrarSesion();
    setCarrito([]);
    setUsuario(null);
  };
  const onRegistro = (datos) => api.registrar(datos);

  const onPagar = async (datos, pagoExitoso) => {
    const pedido = await api.crearPedido({
      ...datos,
      items: carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad })),
      pagoExitoso,
    });
    if (pagoExitoso) {
      setCarrito([]);
      recargarProductos();
    }
    return pedido.id;
  };

  const onGuardarProducto = async (producto) => {
    await api.guardarProducto(producto);
    await recargarProductos();
  };
  const onEliminarProducto = async (id) => {
    await api.eliminarProducto(id);
    await recargarProductos();
  };

  if (verificandoSesion) {
    return <p className="text-center py-5">Verificando sesión...</p>;
  }

  const tienda = (element) => (
    <RutaProtegida usuario={usuario} roles={SOLO_TIENDA}>{element}</RutaProtegida>
  );

  return (
    <Router>
      <Header cantidadCarrito={contarProductos(carrito)} usuario={usuario} onLogout={onLogout} />
      {errorCarga && <p className="text-center text-danger mt-3">{errorCarga}</p>}
      <Routes>
        <Route path="/" element={tienda(<Inicio productos={productos} onAgregar={onAgregar} />)} />
        <Route path="/catalogo" element={tienda(<Catalogo productos={productos} onAgregar={onAgregar} />)} />
        <Route path="/producto/:id" element={tienda(<Producto productos={productos} onAgregar={onAgregar} />)} />
        <Route
          path="/carrito"
          element={tienda(
            <Carrito carrito={carrito} descuento={descuento} usuario={usuario}
              onCambiarCantidad={onCambiarCantidad} onEliminar={onEliminar} onVaciar={onVaciar} />
          )}
        />
        <Route
          path="/login"
          element={
            <RutaProtegida usuario={usuario} roles={[INVITADO]}>
              <Login onLogin={onLogin} />
            </RutaProtegida>
          }
        />
        <Route
          path="/registro"
          element={
            <RutaProtegida usuario={usuario} roles={[INVITADO]}>
              <Registro onRegistro={onRegistro} />
            </RutaProtegida>
          }
        />
        <Route
          path="/checkout"
          element={
            <RutaProtegida usuario={usuario} roles={COMPRADORES}>
              <Checkout carrito={carrito} productos={productos} descuento={descuento}
                usuario={usuario} onPagar={onPagar} />
            </RutaProtegida>
          }
        />
        <Route
          path="/pedido/:id"
          element={
            <RutaProtegida usuario={usuario} roles={COMPRADORES}>
              <Pedido />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel/productos"
          element={
            <RutaProtegida usuario={usuario} roles={PERSONAL}>
              <PanelProductos productos={productos} rol={rol} onEliminar={onEliminarProducto} />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel/productos/:id"
          element={
            <RutaProtegida usuario={usuario} roles={PERSONAL}>
              <PanelProductoDetalle productos={productos} rol={rol} onGuardar={onGuardarProducto} />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel/pedidos"
          element={
            <RutaProtegida usuario={usuario} roles={PERSONAL}>
              <PanelPedidos />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel/pedidos/:id"
          element={
            <RutaProtegida usuario={usuario} roles={PERSONAL}>
              <PanelPedidoDetalle />
            </RutaProtegida>
          }
        />
        <Route
          path="/panel/usuarios"
          element={
            <RutaProtegida usuario={usuario} roles={[ADMINISTRADOR]}>
              <PanelUsuarios usuarioActual={usuario} />
            </RutaProtegida>
          }
        />
      </Routes>
      <footer className="text-center text-secundario py-4 border-top border-secondary mt-4">
        <p className="mb-1">Teléfono: +56 2 2244 556 | Antonio Varas #666, Santiago</p>
        <p className="mb-0">Horario: Lunes a Viernes de 09:00 a 18:00</p>
      </footer>
    </Router>
  );
}

export default App;
