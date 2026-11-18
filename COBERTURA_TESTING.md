# Documento de cobertura de testing — Level-Up Gamer (Frontend React)

**Herramientas:** Jasmine 5 (pruebas) · Karma 6 (ejecutor, ChromeHeadless) · Testing Library para React (render y eventos del DOM) · karma-coverage + Istanbul (cobertura).
**Comandos:** `npm test` (ejecutar) · `npm run test:coverage` (ejecutar + reporte en `coverage/index.html`).

## 1. Resultado de la última ejecución

| Métrica | Resultado |
|---|---|
| Pruebas ejecutadas | 20 de 20 exitosas |
| Archivos de prueba | 7 (`*.spec.js`) |
| Cobertura de líneas | 70.70% (309/437) |
| Cobertura de sentencias | 68.71% (336/489) |
| Cobertura de ramas | 56.00% (196/350) |
| Cobertura de funciones | 66.22% (100/151) |

## 2. Pruebas realizadas

| N° | Archivo | Qué verifica | Técnica |
|---|---|---|---|
| 1 | `utils/validaciones.spec.js` | Cálculo de edad según fecha de nacimiento | Reloj falso (`jasmine.clock().mockDate`) |
| 2 | `utils/validaciones.spec.js` | Correos `@duoc.cl` y `@duocuc.cl` reconocidos; otros dominios rechazados | Lógica pura |
| 3 | `utils/validaciones.spec.js` | Un menor de 18 años es rechazado en el registro | Regla de negocio |
| 4 | `utils/validaciones.spec.js` | Contraseñas que no coinciden dan error | Lógica pura |
| 5 | `utils/carrito.spec.js` | Agregar producto nuevo y sumar cantidad si ya estaba | Lógica pura |
| 6 | `utils/carrito.spec.js` | No se puede agregar más unidades que el stock disponible | Regla de negocio |
| 7 | `utils/carrito.spec.js` | Subtotal, descuento Duoc 20%, IVA 19% y total | Lógica pura |
| 8 | `utils/carrito.spec.js` | Detecta productos sin stock suficiente antes de pagar | Lógica pura |
| 9 | `components/ProductCard.spec.js` | Muestra nombre y precio; clic en "Agregar al carrito" llama a `onAgregar` | Spy (mock) + evento de clic |
| 10 | `components/ProductCard.spec.js` | Producto sin stock muestra "Agotado" y el botón queda deshabilitado | Renderizado + DOM |
| 11 | `views/Registro.spec.js` | Registro con correo Duoc crea la cuenta, muestra el 20% y avisa a App | Eventos + spy |
| 12 | `views/Catalogo.spec.js` | Muestra todos los productos y los filtra por categoría | Manipulación del DOM + estado |
| 13 | `App.spec.js` | Al agregar un producto sube el contador del carrito del menú | Integración con API simulada |
| 14 | `App.spec.js` | Al iniciar sesión se borra el carrito armado sin estar logueado | Integración |
| 15 | `App.spec.js` | La sesión se mantiene al recargar: restaura al usuario desde el token guardado (`GET /auth/me`) | Integración (sesión) |
| 16 | `App.spec.js` | El vendedor solo ve Productos y Órdenes (sin tienda, carrito ni usuarios) | Integración (roles) |
| 17 | `App.spec.js` | Compra exitosa: "Pedido realizado", total con IVA, carrito vacío y stock descontado | Integración (flujo completo) |
| 18 | `App.spec.js` | Compra fallida: no se descuenta stock y el carrito se conserva | Integración (flujo completo) |
| 19 | `api/api.spec.js` | Si el access token expira (401), renueva con el refresh token y repite la petición | Mock de `fetch` (spy) |
| 20 | `api/api.spec.js` | Si el refresh token también falla, se borra la sesión y se avisa que expiró | Mock de `fetch` (spy) |

En las pruebas de integración el backend se reemplaza por una API simulada (`testing/apiFalsa.js`) que intercepta `window.fetch` con un spy de Jasmine; así las pruebas no dependen de que el backend esté corriendo.

## 3. Cobertura por archivo

| Archivo | Comentario |
|---|---|
| `utils/carrito.js`, `utils/roles.js`, `utils/sesion.js`, `api/api.js` | Cubiertos por las pruebas 5 a 8 y 13 a 20 (excepto eliminar y cambiar cantidad) |
| `components/ProductCard.js`, `Header.js`, `RutaProtegida.js`, `ResumenPrecios.js`, `DetallePedido.js` | Cubiertos por las pruebas 9, 10 y de integración |
| `views/Catalogo.js`, `Registro.js`, `Login.js`, `Carrito.js`, `Checkout.js`, `Pedido.js` | Cubiertos por las pruebas 11, 12 y de integración 13 a 18 |
| `App.js` | Cubierto por las pruebas de integración; quedan sin invocar los manejadores del panel de administración |
| `views/panel/*` | Sin pruebas propias en esta entrega (solo se verifica el menú del vendedor, prueba 15) |

## 4. Análisis

- Las pruebas cubren las reglas de negocio principales del caso: **mayor de 18 años, descuento del 20% con correo Duoc, stock, IVA, carrito nuevo al iniciar sesión, sesión persistente, renovación del token JWT, roles y compra exitosa/fallida**, además de un componente con evento, un formulario completo, un filtro que cambia el DOM y pruebas de integración del flujo de compra.
- El panel de administración (productos, órdenes y usuarios), Inicio y Producto no tienen pruebas propias, lo que explica la cobertura global cercana al 70%. Son el siguiente paso natural para ampliar la suite.
- Se comprobó que las pruebas detectan errores: al alterar a propósito la edad mínima o el dominio Duoc, las pruebas correspondientes fallan.
- No se prueban la reproducción del video ni los estilos visuales (CSS).
