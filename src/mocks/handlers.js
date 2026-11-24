import { http, HttpResponse, delay, graphql } from "msw";
import { destinos, vuelos, hoteles } from "../data/viajes";

// Se usa la ruta base de vite para que los mocks funcionen tambien en GitHub Pages.
const base = import.meta.env.BASE_URL;
const apiGraphQL = graphql.link(`${base}graphql`);

export const handlers = [
  // RESTentrega la lista completa de destinos.
  http.get(`${base}api/destinos`, async () => {
    await delay(350);
    return HttpResponse.json(destinos);
  }),
  // Graphql responde con vuelos y hoteles del destino solicitado.
  apiGraphQL.query("ObtenerOpcionesViaje", async ({ variables }) => {
    await delay(350);
    const { destinoId } = variables;
    return HttpResponse.json({
      data: {
        vuelos: vuelos.filter((vuelo) => vuelo.destinoId === destinoId),
        hoteles: hoteles.filter((hotel) => hotel.destinoId === destinoId),
      },
    });
  }),
];
