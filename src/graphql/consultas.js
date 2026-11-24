import { gql } from '@apollo/client'

// Graphql devuelve unicamente los campos que necesita la vista de detalle.
export const OBTENER_OPCIONES = gql`
  query ObtenerOpcionesViaje($destinoId: ID!) {
    vuelos(destinoId: $destinoId) {
      id aerolinea origen salida regreso precio cupos
    }
    hoteles(destinoId: $destinoId) {
      id nombre categoria precioNoche disponible habitaciones
    }
  }
`
