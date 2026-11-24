import { Link } from "react-router-dom";
export default function Inicio() {
  return (
    <>
      <section className="hero">
        <div className="contenedor hero-contenido">
          <span className="hero-etiqueta">
            TU PRÓXIMA AVENTURA COMIENZA AQUÍ
          </span>
          <h1>
            El mundo está
            <br />
            <em>esperando por ti.</em>
          </h1>
          <p>
            Descubre destinos increíbles, compara vuelos y encuentra el hotel
            perfecto para tu próxima escapada.
          </p>
          <Link className="boton boton-claro" to="/destinos">
            Explorar destinos <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section className="contenedor beneficios espacio">
        <div>
          <span className="beneficio-icono">🌎</span>
          <h3>Destinos para descubrir</h3>
          <p>Explora ciudades y actividades en distintos continentes.</p>
        </div>
        <div>
          <span className="beneficio-icono">✈️</span>
          <h3>Opciones de vuelos</h3>
          <p>Consulta precios, fechas y cupos disponibles.</p>
        </div>
        <div>
          <span className="beneficio-icono">🏨</span>
          <h3>Hoteles a tu medida</h3>
          <p>Compara alojamiento y disponibilidad por destino.</p>
        </div>
      </section>
      <section className="franja">
        <div className="contenedor franja-contenido">
          <div>
            <span className="eyebrow">PLANIFICA SIN COMPLICACIONES</span>
            <h2>Tu viaje, a tu manera</h2>
            <p>
              Selecciona un destino y revisa vuelos y hoteles en un mismo lugar.
            </p>
          </div>
          <Link to="/destinos" className="boton boton-oscuro">
            Ver todos los destinos →
          </Link>
        </div>
      </section>
    </>
  );
}
