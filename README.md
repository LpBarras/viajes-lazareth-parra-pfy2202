# ViajaFácil - Desarrollo Frontend II (PFY2202)

Sumativa de Lazareth Parra, se utiliza React + Vite, React Router, MSW (API REST y GraphQL simuladas) y Apollo Client.
Las imagenes en la pagina se obtuvieron desde Unsplash, por lo que se ecesita coneccion a net para visualizarlas.
## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## intrucciones

1. Descomprimir el proyecto y abrir la carpeta en VS Code.
2. Abrir una terminal en la raíz o en cmd en la carpeta de origen.
3. Ejecutar `npm install`.
4. Ejecutar `npm run dev`.
5. Abrir la direccion http://localhost:5173/#/ o la de gh pages https://lpbarras.github.io/viajes-lazareth-parra-pfy2202/#/

## Funcionalidades

-Inicio con presentación de la agencia y destinos destacados
-Listado de destinos con imágenes e información general obtenida mediante una API REST simulada.
-Búsqueda y filtro de destinos y opciones de viaje
-Detalle de cada destino 
-Consulta de vuelos y hoteles mediante GraphQL y Apollo Client.
-Selección de fechas disponibles para vuelos y alojamiento, solo se agregaron para esta semana.
-Carrito con botones para aumentar, disminuir o eliminar unidades
-Se descuentan o devolven cupos de boletos y hoteles si se eliminan, aumentan o disminuyen desde el carrito o pagina de viajes segun la fecha seleccionada.
-Cálculo automático de cantidades y total del carrito, con almacenamiento local para conservar la selección al recargar.
-Página de contacto de demostración, navegación entre secciones e interfaz adaptable a distintos tamaños de pantalla.
-Mensajes de carga y error al consultar los datos simulados.

## Estructura

-src/pages: pantallas de inicio, destinos, detalle, carrito y contacto.
-src/components: navegación, pie de página, tarjetas y mensajes reutilizables.
-src/context: Context para administrar el carrito y la disponibilidad.
-src/data: información de ejemplo sobre destinos, vuelos y hoteles.
-src/graphql: consultas GraphQL de vuelos y hoteles.
-src/mocks: configuración de MSW y respuestas simuladas de REST y GraphQL.
-src/utils: funciones para fechas y formato de precios.
-src/index.css: estilos generales y diseño responsive.
-public/mockServiceWorker.js: archivo generado automáticamente por MSW.
