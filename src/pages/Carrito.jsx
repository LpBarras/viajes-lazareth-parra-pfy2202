import { Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { moneda } from "../utils/moneda";

export default function Carrito() {
  const { carrito, cambiarCantidad, eliminar, vaciar, unidades, total } =
    useCarrito();
  return (
    <section className="contenedor espacio">
      <div className="cabecera-pagina">
        <span className="eyebrow">TU SELECCIÓN</span>
        <h1>Carrito de viajes</h1>
        <p>Revisa tus boletos y alojamientos antes de continuar.</p>
      </div>
      {!carrito.length ? (
        <div className="estado carrito-vacio">
          <h2>🛒 Tu carrito está vacío</h2>
          <p>Busca un destino y agrega vuelos u hoteles.</p>
          <Link className="boton boton-oscuro" to="/destinos">
            Explorar destinos
          </Link>
        </div>
      ) : (
        <div className="carrito-distribucion">
          <div className="opciones">
            {carrito.map((item) => (
              <article className="opcion carrito-linea" key={item.clave}>
                <div>
                  <span className="etiqueta">
                    {item.tipo === "vuelo" ? "✈ Vuelo" : "🏨 Hotel"} ·{" "}
                    {item.destino}
                  </span>
                  <h3>{item.nombre}</h3>
                  <p>{item.descripcion}</p>
                  <p>Precio unitario: {moneda(item.precio)}</p>
                  <button
                    className="enlace-eliminar"
                    type="button"
                    onClick={() => eliminar(item.clave)}
                  >
                    Eliminar
                  </button>
                </div>
                <div className="carrito-controles">
                  <div className="cantidad-botones">
                    <button
                      type="button"
                      aria-label={`Disminuir ${item.nombre}`}
                      onClick={() =>
                        item.cantidad === 1
                          ? eliminar(item.clave)
                          : cambiarCantidad(item.clave, item.cantidad - 1)
                      }
                    >
                      −
                    </button>
                    <strong aria-live="polite">{item.cantidad}</strong>
                    <button
                      type="button"
                      aria-label={`Aumentar ${item.nombre}`}
                      disabled={item.cantidad >= item.maximo}
                      onClick={() =>
                        cambiarCantidad(item.clave, item.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <strong>{moneda(item.precio * item.cantidad)}</strong>
                  <small>Máximo disponible: {item.maximo}</small>
                </div>
              </article>
            ))}
          </div>
          <aside className="resumen-carrito">
            <h2>Resumen de compra</h2>
            <p>
              Unidades seleccionadas: <strong>{unidades}</strong>
            </p>
            <div className="total-carrito">
              <span>Total estimado</span>
              <strong>{moneda(total)}</strong>
            </div>
            <p className="aviso">
              Los hoteles se calculan por noche.
            </p>
            <Link className="boton boton-oscuro" to="/destinos">
              Seguir explorando
            </Link>
            <button
              type="button"
              className="boton boton-secundario"
              onClick={vaciar}
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
