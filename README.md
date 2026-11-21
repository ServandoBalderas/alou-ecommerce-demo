# ALOU GOODS — Demo de comercio electrónico

Una tienda **ficticia y educativa** desarrollada para el portafolio de **Alou™ Estudios**. El objetivo es practicar diseño frontend y el funcionamiento de un catálogo y un carrito sin procesar pagos ni recopilar información personal.

## Vista previa

![Vista previa de escritorio de ALOU GOODS](preview/desktop-hero.png)

[Ver captura completa de escritorio](preview/desktop.png) · [Ver captura móvil](preview/mobile.png)

## Características

- Catálogo de 10 productos ficticios, ilustrados con SVG locales.
- Filtros por categoría, buscador y ordenación por nombre/precio.
- Vista detallada por producto.
- Carrito con cantidades, eliminación, subtotales en MXN y persistencia local mediante `localStorage`.
- Flujo de compra simulado: confirma el número de artículos, no pide datos ni hace transacciones.
- Diseño responsive (escritorio y móvil), navegación por teclado y soporte de movimiento reducido.
- Archivos estáticos listos para Cloudflare Pages, sin dependencias ni compilación.

## Tecnologías

HTML5 · CSS3 · JavaScript (vanilla) · SVG · localStorage

## Ejecutar

Abre `index.html` en el navegador, o inicia un servidor local desde el directorio:

```bash
python3 -m http.server 8080
```

Después abre `http://localhost:8080`.

## Validaciones realizadas

Se probaron en un navegador de escritorio: carga del catálogo, filtro por categoría, búsqueda, añadir al carrito, modificar cantidades, resumen de compra simulada, ventana de detalles y ausencia de desbordamiento horizontal a 390 px. No se realizaron pedidos ni pagos. La persistencia de `localStorage` y las integraciones de despliegue deberán volver a comprobarse al publicar la demo desde una URL real.

## Publicar con Cloudflare Pages

1. Crea un repositorio, por ejemplo `alou-ecommerce-demo`.
2. Sube **los archivos de esta carpeta a la raíz del repositorio**.
3. En Cloudflare Pages: conecta el repositorio GitHub.
4. Framework preset: **None**; build command: **vacío**; output directory: **/** (raíz del proyecto, si la interfaz lo solicita).
5. Publica primero en el subdominio de pruebas de Pages; no es necesario comprar un dominio.

> Verifica en la interfaz de Cloudflare los campos disponibles para despliegues sin compilación. La carpeta de salida debe contener `index.html`.

## Seguridad y alcance

- **No es una tienda real:** todos los productos, imágenes, nombres y precios son ficticios.
- No utiliza Shopify, WooCommerce, backend, base de datos, inventario real ni pasarelas de pago.
- `localStorage` conserva únicamente los IDs y cantidades de productos ficticios.
- Checkout exclusivamente de demostración, sin datos personales.
- `meta robots noindex,nofollow` activado inicialmente para que los buscadores no traten esta demo como una tienda comercial. Cambiar solo si el objetivo de publicación lo requiere.
- No se utilizan librerías JavaScript ni imágenes externas de terceros. Las fuentes opcionales proceden de Google Fonts; existen fuentes de reserva locales.

## Evolución de aprendizaje

1. Crear pruebas automatizadas de los flujos de carrito y filtros.
2. Agregar rutas de detalle de producto, variantes y stock ficticio.
3. Reconstruir el catálogo en una tienda de desarrollo **Shopify** para aprender el editor de temas y **Liquid**.
4. Crear una segunda versión en **WooCommerce/WordPress** y comparar sus paneles de administración.
5. Documentar las diferencias de costos, hosting, integraciones, mantenimiento y propiedad de datos.

---

Hecho para aprendizaje y portafolio de **Alou™ Estudios** (2026).
