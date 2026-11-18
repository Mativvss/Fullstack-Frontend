# Level-Up Gamer — Frontend en React

Proyecto de la asignatura **DSY1104 Desarrollo Full Stack II** (Evaluación Parcial 2).
Migración de la tienda online Level-Up Gamer (Parcial 1: HTML/CSS/JS) a **React**, con diseño responsivo en **React Bootstrap** y pruebas unitarias con **Jasmine + Karma**. En la Evaluación Parcial 3 se integró con un **backend Spring Boot** (API REST, base de datos MySQL y autenticación JWT): el repositorio del backend es `levelup-backend`.

**Equipo:** Matías Franke · Florencia Ferrada · Matías Letelier

## Estructura del proyecto

```
levelup-react/
├── public/                        Archivos estáticos (se sirven tal cual)
│   ├── index.html                 Página base donde React dibuja la aplicación (fuentes Orbitron y Roboto)
│   └── assets/
│       ├── img/                   Imágenes de productos, logo y portada (poster) del video
│       └── video/                 Video de la tienda (comunidad-gamer.mp4 y .webm) que reproduce la página de inicio
├── src/                           Código fuente de la aplicación
│   ├── index.js                   Punto de entrada: carga Bootstrap, estilos y dibuja <App />
│   ├── index.css                  Tema gamer (negro, azul eléctrico #1E90FF, verde neón #39FF14)
│   ├── App.js                     Componente raíz: define las rutas protegidas por rol y guarda el estado compartido (productos, usuario con sesión, carrito)
│   ├── App.spec.js                Prueba de integración de la aplicación
│   ├── api/                       Comunicación con el backend
│   │   ├── api.js                 Llamadas a la API REST con fetch: agrega el token JWT, renueva la sesión con el refresh token y traduce los errores
│   │   └── api.spec.js            Pruebas de la renovación del token
│   ├── hooks/
│   │   └── useCarga.js            Hook que carga datos desde la API (cargando / error / datos)
│   ├── testing/                   Ayudas solo para pruebas
│   │   ├── apiFalsa.js            Backend simulado con jasmine.spyOn(window, 'fetch')
│   │   └── datosPrueba.js         Productos de ejemplo para las pruebas
│   ├── components/                Componentes reutilizables
│   │   ├── Header.js              Menú de navegación responsivo; cambia según el rol y muestra el contador del carrito
│   │   ├── RutaProtegida.js       Deja entrar a una ruta solo a los roles permitidos
│   │   ├── ResumenPrecios.js      Subtotal, descuento, IVA y total
│   │   ├── DetallePedido.js       Detalle de un pedido (cliente, entrega, productos, totales)
│   │   ├── ProductCard.js         Tarjeta de producto (imagen, nombre, precio, botones)
│   │   └── ProductCard.spec.js
│   ├── views/                     Páginas (una por ruta)
│   │   ├── Inicio.js              /               Frase principal, video embebido y productos destacados
│   │   ├── Catalogo.js            /catalogo       Todos los productos con filtro por categoría
│   │   ├── Producto.js            /producto/:id   Detalle de un producto
│   │   ├── Carrito.js             /carrito        Resumen del carrito, cantidades, IVA, descuento y total
│   │   ├── Checkout.js            /checkout       Datos personales, despacho o retiro en tienda y pago (exitoso / rechazado)
│   │   ├── Pedido.js              /pedido/:id     Resultado de la compra: "Pedido realizado" o "Compra fallida"
│   │   ├── panel/                 Panel de administración (solo administrador y vendedor)
│   │   │   ├── PanelProductos.js        /panel/productos        Lista de productos con stock
│   │   │   ├── PanelProductoDetalle.js  /panel/productos/:id    Detalle (vendedor) o edición/creación (administrador)
│   │   │   ├── PanelPedidos.js          /panel/pedidos          Lista de órdenes
│   │   │   ├── PanelPedidoDetalle.js    /panel/pedidos/:id      Detalle de una orden
│   │   │   └── PanelUsuarios.js         /panel/usuarios         Usuarios y roles (solo administrador)
│   │   ├── Login.js               /login          Inicio de sesión (valida contra los usuarios guardados)
│   │   ├── Registro.js            /registro       Registro con validación (mayor de 18, descuento Duoc); crea usuarios con rol cliente
│   │   ├── Catalogo.spec.js       Prueba del filtro del catálogo
│   │   └── Registro.spec.js       Prueba del formulario de registro
│   ├── utils/                     Lógica pura (sin interfaz), fácil de probar
│   │   ├── validaciones.js        Edad, correo, validación de registro/login/checkout/producto, formato de precio
│   │   ├── carrito.js             Agregar (respetando stock), eliminar, cantidades, IVA, descuento y total
│   │   ├── pedidos.js             Constantes de estado del pedido (compra exitosa / fallida)
│   │   ├── roles.js               Roles y ruta de inicio de cada rol
│   │   ├── sesion.js              Guarda los tokens de la sesión en sessionStorage
│   │   ├── carrito.spec.js
│   │   └── validaciones.spec.js
├── karma.conf.js                  Configuración de Karma (Jasmine + webpack + babel + ChromeHeadless + cobertura)
├── test-entry.js                  Carga todos los archivos *.spec.js para Karma
├── package.json                   Dependencias y comandos (start, build, test, test:coverage)
├── COBERTURA_TESTING.md           Documento de cobertura de testing
└── README.md                      Este archivo
```

## Cómo correrlo

Requisitos: Node 18 o superior y Google Chrome instalado (Karma lo usa para correr las pruebas). Para usar la tienda hay que tener **el backend corriendo** en `http://localhost:8080` (ver el README de `levelup-backend`). Si el backend está en otra dirección, definir `REACT_APP_API_URL` (por ejemplo `REACT_APP_API_URL=http://localhost:8080/api npm start`). Las pruebas no necesitan el backend: usan una API simulada.

```bash
npm install            # instala las dependencias (una sola vez)
npm start              # levanta la tienda en http://localhost:3000
npm test               # corre las pruebas con Karma + Jasmine (ChromeHeadless)
npm run test:coverage  # pruebas + reporte de cobertura en coverage/index.html
npm run build          # genera la versión de producción en build/
```

Si Karma no encuentra Chrome, indicar su ruta:
`set CHROME_BIN=C:\Program Files\Google\Chrome\Application\chrome.exe` (Windows) o `export CHROME_BIN=/ruta/a/chrome` (Linux).

## Funcionalidades

- **Catálogo** con 10 productos en 7 categorías, filtro por categoría, detalle por URL (`/producto/:id`) y **stock** visible (botón deshabilitado si está agotado; no se puede agregar más que el stock). Los productos vienen de la API.
- **Carrito** de compras: agregar, aumentar/disminuir cantidad, eliminar, vaciar, con **IVA 19%** y descuento Duoc.
- **Carrito de invitado**: se puede armar sin iniciar sesión, pero al iniciar sesión se borra y se parte con un carrito nuevo.
- **Proceso de compra completo** (`/checkout`): datos personales, **despacho a domicilio o retiro en tienda** y pago. Termina en **compra exitosa** ("¡Pedido realizado!", el backend descuenta el stock) o **compra fallida** (no se cobra, no se descuenta stock y el carrito se conserva). Los totales finales los calcula el backend.
- **Autenticación con JWT**: el login entrega un access token (15 min) y un refresh token (7 días). El frontend los guarda en `sessionStorage`, envía el access token en cada petición (`Authorization: Bearer`) y, si el servidor responde 401, **renueva la sesión automáticamente** con el refresh token y repite la petición.
- **Sesión persistente**: al recargar la página se restaura al usuario consultando `GET /api/auth/me` con el token guardado (no se confía en un rol guardado en el navegador). Si el refresh token expira, se cierra la sesión.
- **Roles y restricciones de acceso** en el frontend (rutas protegidas con `RutaProtegida` y menú según el rol). El backend vuelve a validar cada petición, por lo que ocultar una pantalla no reemplaza la seguridad real.
- **Registro** con validaciones (nombre, correo, **mayor de 18 años**, contraseña). Con correo `@duoc.cl` o `@duocuc.cl` se obtiene **20% de descuento de por vida**.
- **Video embebido** en la página de inicio, reproducido desde `public/assets/video` (no depende de YouTube).
- **Diseño responsivo** con la grilla de Bootstrap y menú hamburguesa en celular.

## Roles y usuarios de prueba

| Rol | Usuario de prueba | Qué puede hacer |
|---|---|---|
| Administrador | `admin@levelup.cl` / `admin123` | Acceso total: tienda, productos (crear, editar, eliminar, stock), órdenes y usuarios (cambiar rol, eliminar) |
| Vendedor | `vendedor@levelup.cl` / `vendedor123` | Solo ve la lista de productos con su detalle y la lista de órdenes con su detalle. No ve tienda, carrito ni otras opciones |
| Cliente | `cliente@levelup.cl` / `cliente123` | Solo la tienda: catálogo, carrito y compra |

Quien se registra desde `/registro` queda con rol **cliente**. Sin iniciar sesión (invitado) solo se puede ver la tienda y armar el carrito.

Los usuarios, productos y pedidos se guardan en la base de datos MySQL del backend. En el navegador solo quedan los tokens de la sesión (`sessionStorage`).

## Pruebas

20 pruebas unitarias y de integración en 7 archivos `*.spec.js`, escritas con **Jasmine** y ejecutadas con **Karma**. Detalle y cobertura en [COBERTURA_TESTING.md](COBERTURA_TESTING.md).

## Reparto del trabajo

| Parte | Contenido | Archivos principales |
|---|---|---|
| 1 — Base y catálogo | Configuración del proyecto, tema gamer, productos, tarjeta de producto, catálogo con filtro, detalle de producto, inicio con video | `package.json`, `karma.conf.js`, `public/`, `src/index.*`, `ProductCard`, `Catalogo`, `Producto`, `Inicio` |
| 2 — Usuarios | Validaciones, formulario de registro (mayor de 18 y descuento Duoc) y login | `utils/validaciones.js`, `views/Registro.js`, `views/Login.js` |
| 3 — Carrito y aplicación | Lógica del carrito (stock, IVA), carrito, checkout y pedido, menú, componente raíz con rutas y estado | `utils/carrito.js`, `utils/pedidos.js`, `views/Carrito.js`, `views/Checkout.js`, `views/Pedido.js`, `components/Header.js`, `App.js` |
| Entrega 2 — Roles y panel | Roles (administrador, vendedor, cliente), rutas protegidas y panel de productos, órdenes y usuarios | `utils/roles.js`, `utils/sesion.js`, `components/RutaProtegida.js`, `views/panel/` |
