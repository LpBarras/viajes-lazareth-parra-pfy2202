import { Link } from "react-router-dom";
export default function TarjetaDestino({ destino }) {
  return (
    <article className="tarjeta">
      <img
        src={destino.imagen}
        alt={`Vista turística de ${destino.ciudad}`}
        loading="lazy"
      />
      <div className="tarjeta-cuerpo">
        <span className="etiqueta">{destino.region}</span>
        <h3>{destino.ciudad}</h3>
        <p className="pais">📍 {destino.pais}</p>
        <p>{destino.descripcion}</p>
        <p className="actividades">
          <strong>Imperdibles:</strong>{" "}
          {destino.actividades.slice(0, 2).join(" · ")}
        </p>
        <Link className="boton boton-oscuro" to={`/destinos/${destino.id}`}>
          Explorar viaje <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
