import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { OBTENER_OPCIONES } from "../graphql/consultas";
import Cargando from "../components/Cargando";
import MensajeError from "../components/MensajeError";
import { useCarrito } from "../context/CarritoContext";
import { moneda } from "../utils/moneda";
import { fechasSemana } from "../utils/fechas";

export default function DetalleDestino() {
  const { id } = useParams();
  const { agregar, obtenerStockDisponible } = useCarrito();
  const [avisoCarrito, setAvisoCarrito] = useState("");
  const [busquedaOpcion, setBusquedaOpcion] = useState("");
  const [cantidad, setCantidad] = useState({});
  const [fechas, setFechas] = useState({});
  const diasDisponibles = fechasSemana();
  const fechasValidas = diasDisponibles.filter(
    (d) => d.valor >= new Date().toLocaleDateString("en-CA"),
  );
  const opcionesFecha = fechasValidas.length ? fechasValidas : diasDisponibles;

  // Obtiene la disponibilidad restante de cada vuelo u hotel considerando la fecha seleccionada y el carrito
  function consultarDisponibilidad(tipo, opcion) {
    const esVuelo = tipo === "vuelo";

    const stockTotal = esVuelo ? opcion.cupos : opcion.habitaciones;

    const fecha = fechas[`${tipo}-${opcion.id}`] || opcionesFecha[0].valor;

    return obtenerStockDisponible(tipo, opcion.id, fecha, stockTotal);
  }

  // Agrega vuelos u hoteles al carrito verificando su disponibilidad.
  function agregarOpcion(tipo, opcion) {
    const esVuelo = tipo === "vuelo";

    // Obtiene el stock original entregado por Graph
    const maximo = esVuelo ? opcion.cupos : opcion.habitaciones;

    // Obtiene la fecha seleccionada por el usuario.
    const fecha = fechas[`${tipo}-${opcion.id}`] || opcionesFecha[0].valor;

    // Comprueba que la fecha pertenezca a los días disponibles.
    if (!opcionesFecha.some((d) => d.valor === fecha)) {
      setAvisoCarrito("Selecciona una fecha válida de esta semana.");
      return;
    }

    // Obtiene las unidades que el usuario desea agregar.
    const unidadesSolicitadas = Number(cantidad[`${tipo}-${opcion.id}`] || 1);

    // Calcula el stock que queda después de descontar el carrito.
    const stockDisponible = obtenerStockDisponible(
      tipo,
      opcion.id,
      fecha,
      maximo,
    );

    // Evita agregar cantidades invalidas
    if (
      !Number.isInteger(unidadesSolicitadas) ||
      unidadesSolicitadas < 1 ||
      unidadesSolicitadas > stockDisponible ||
      (!esVuelo && !opcion.disponible)
    ) {
      setAvisoCarrito(
        `No es posible agregar esa cantidad. Quedan ${stockDisponible} unidades disponibles.`,
      );
      return;
    }

    // Envia la opcion seleccionada al carrito.
    const exito = agregar(
      {
        tipo,
        id: opcion.id,
        fecha,
        destino: destino.ciudad,
        nombre: esVuelo
          ? `${opcion.aerolinea} · ${opcion.origen} → ${destino.ciudad}`
          : opcion.nombre,
        descripcion: esVuelo
          ? `Vuelo de ida y vuelta · fecha seleccionada: ${fecha}`
          : `Alojamiento · fecha seleccionada: ${fecha} (1 noche por unidad)`,
        precio: esVuelo ? opcion.precio : opcion.precioNoche,
        maximo,
      },
      unidadesSolicitadas,
    );

    // Informa el resultado
    setAvisoCarrito(
      exito
        ? "Se agregó al carrito correctamente."
        : "No se puede superar la disponibilidad de esta opción.",
    );
  }
  const [destino, setDestino] = useState(null);
  const [cargandoDestino, setCargandoDestino] = useState(true);
  const [errorDestino, setErrorDestino] = useState("");
  const [intento, setIntento] = useState(0);
  const [pestana, setPestana] = useState("vuelos");

  // rest permite recuperar los datos generales del destino seleccionado.
  useEffect(() => {
    const controlador = new AbortController();
    async function cargar() {
      setCargandoDestino(true);
      setErrorDestino("");
      try {
        const respuesta = await fetch(
          `${import.meta.env.BASE_URL}api/destinos`,
          { signal: controlador.signal },
        );
        if (!respuesta.ok) throw new Error("No se pudo consultar el destino");
        const tipo = respuesta.headers.get("content-type") || "";
        if (!tipo.includes("application/json"))
          throw new Error(
            "La API no respondió",
          );
        const datos = await respuesta.json();
        setDestino(datos.find((item) => item.id === id) || null);
      } catch (err) {
        if (err.name !== "AbortError") setErrorDestino(err.message);
      } finally {
        if (!controlador.signal.aborted) setCargandoDestino(false);
      }
    }
    cargar();
    return () => controlador.abort();
  }, [id, intento]);

  // Apollo Client realiza la consulta GraphqL para los vuelos y hoteles del destino.
  const { data, loading, error, refetch } = useQuery(OBTENER_OPCIONES, {
    variables: { destinoId: id },
    fetchPolicy: "network-only",
  });
  if (cargandoDestino) return <Cargando mensaje="Cargando destino..." />;
  if (errorDestino)
    return (
      <section className="contenedor espacio">
        <MensajeError
          mensaje={errorDestino}
          reintentar={() => setIntento((n) => n + 1)}
        />
      </section>
    );
  if (!destino)
    return (
      <section className="contenedor espacio">
        <h1>Destino no encontrado</h1>
        <Link to="/destinos">Volver a destinos</Link>
      </section>
    );
  return (
    <>
      <section
        className="detalle-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(9,30,48,.86),rgba(9,30,48,.22)),url("${destino.imagen}")`,
        }}
      >
        <div className="contenedor">
          <Link className="volver" to="/destinos">
            ← Volver a destinos
          </Link>
          <span className="hero-etiqueta">{destino.pais.toUpperCase()}</span>
          <h1>{destino.ciudad}</h1>
          <p>{destino.descripcion}</p>
        </div>
      </section>
      <section className="contenedor espacio">
        <div className="detalle-intro">
          <div>
            <span className="eyebrow">DESCUBRE TU VIAJE</span>
            <h2>Planea tu estadía en {destino.ciudad}</h2>
            <p>
              Consulta alternativas de vuelos y alojamiento
            </p>
          </div>
          <div className="caja-actividades">
            <strong>Actividades populares</strong>
            <ul>
              {destino.actividades.map((a) => (
                <li key={a}>✓ {a}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pestanas" role="tablist" aria-label="Opciones de viaje">
          <button
            role="tab"
            aria-selected={pestana === "vuelos"}
            className={pestana === "vuelos" ? "activa" : ""}
            onClick={() => setPestana("vuelos")}
          >
            ✈ Vuelos
          </button>
          <button
            role="tab"
            aria-selected={pestana === "hoteles"}
            className={pestana === "hoteles" ? "activa" : ""}
            onClick={() => setPestana("hoteles")}
          >
            🏨 Hoteles
          </button>
        </div>
        <div className="filtros">
          <label className="sr-only" htmlFor="buscar-opcion">
            Buscar vuelo u hotel
          </label>
          <input
            id="buscar-opcion"
            type="search"
            value={busquedaOpcion}
            onChange={(e) => setBusquedaOpcion(e.target.value)}
            placeholder={
              pestana === "vuelos"
                ? "Buscar aerolínea u origen..."
                : "Buscar hotel..."
            }
          />
        </div>
        {avisoCarrito && (
          <p className="confirmacion" role="status">
            {avisoCarrito} <Link to="/carrito">Ver carrito</Link>
          </p>
        )}
        {loading ? (
          <Cargando mensaje="Consultando opciones..." />
        ) : error ? (
          <MensajeError mensaje={error.message} reintentar={() => refetch()} />
        ) : pestana === "vuelos" ? (
          <div className="opciones">
            {data?.vuelos?.length ? (
              data.vuelos
                .filter((v) =>
                  `${v.aerolinea} ${v.origen}`
                    .toLowerCase()
                    .includes(busquedaOpcion.toLowerCase()),
                )
                .map((v) => (
                  <article className="opcion" key={v.id}>
                    <div>
                      <span className="etiqueta">{v.aerolinea}</span>
                      <h3>
                        {v.origen} → {destino.ciudad}
                      </h3>
                      <p>
                        Viaje de ida y vuelta, elige una fecha de esta semana
                      </p>
                      <span
                        className={
                          consultarDisponibilidad("vuelo", v) > 0
                            ? "disponible"
                            : "agotado"
                        }
                      >
                        {consultarDisponibilidad("vuelo", v) > 0
                          ? `${consultarDisponibilidad("vuelo", v)} cupos disponibles`
                          : "Sin cupos disponibles"}
                      </span>
                    </div>
                    <div className="opcion-precio">
                      <small>Por persona · ida y vuelta</small>
                      <strong>{moneda(v.precio)}</strong>
                      <label className="fecha-etiqueta">
                        Fecha del vuelo
                        <select
                          aria-label={`Fecha del vuelo ${v.aerolinea}`}
                          value={
                            fechas[`vuelo-${v.id}`] || opcionesFecha[0].valor
                          }
                          onChange={(e) =>
                            setFechas((prev) => ({
                              ...prev,
                              [`vuelo-${v.id}`]: e.target.value,
                            }))
                          }
                        >
                          {opcionesFecha.map((d) => (
                            <option key={d.valor} value={d.valor}>
                              {d.etiqueta}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="cantidad-etiqueta">
                        Boletos{" "}
                        <input
                          aria-label={`Cantidad de boletos ${v.aerolinea}`}
                          type="number"
                          min="1"
                          max={Math.max(1, consultarDisponibilidad("vuelo", v))}
                          value={cantidad[`vuelo-${v.id}`] || 1}
                          onChange={(e) =>
                            setCantidad((prev) => ({
                              ...prev,
                              [`vuelo-${v.id}`]: e.target.value,
                            }))
                          }
                          disabled={consultarDisponibilidad("vuelo", v) === 0}
                        />
                      </label>
                      <button
                        type="button"
                        className="boton boton-oscuro"
                        disabled={consultarDisponibilidad("vuelo", v) === 0}
                        onClick={() => agregarOpcion("vuelo", v)}
                      >
                        Añadir boletos
                      </button>
                    </div>
                  </article>
                ))
            ) : (
              <p>No hay vuelos para este destino.</p>
            )}
          </div>
        ) : (
          <div className="opciones">
            {data?.hoteles?.length ? (
              data.hoteles
                .filter((h) =>
                  h.nombre.toLowerCase().includes(busquedaOpcion.toLowerCase()),
                )
                .map((h) => (
                  <article className="opcion" key={h.id}>
                    <div>
                      <span className="estrellas">
                        {"★".repeat(h.categoria)}
                      </span>
                      <h3>{h.nombre}</h3>
                      <p>
                        Hotel de {h.categoria} estrellas en {destino.ciudad}
                      </p>
                      <span
                        className={
                          h.disponible &&
                          consultarDisponibilidad("hotel", h) > 0
                            ? "disponible"
                            : "agotado"
                        }
                      >
                        {h.disponible && consultarDisponibilidad("hotel", h) > 0
                          ? `${consultarDisponibilidad("hotel", h)} habitaciones disponibles`
                          : "Sin disponibilidad"}
                      </span>
                    </div>
                    <div className="opcion-precio">
                      <small>Por noche</small>
                      <strong>{moneda(h.precioNoche)}</strong>
                      <label className="fecha-etiqueta">
                        Fecha de ingreso
                        <select
                          aria-label={`Fecha de ingreso ${h.nombre}`}
                          value={
                            fechas[`hotel-${h.id}`] || opcionesFecha[0].valor
                          }
                          onChange={(e) =>
                            setFechas((prev) => ({
                              ...prev,
                              [`hotel-${h.id}`]: e.target.value,
                            }))
                          }
                        >
                          {opcionesFecha.map((d) => (
                            <option key={d.valor} value={d.valor}>
                              {d.etiqueta}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="cantidad-etiqueta">
                        Noches / unidades{" "}
                        <input
                          aria-label={`Cantidad de noches ${h.nombre}`}
                          type="number"
                          min="1"
                          max={Math.max(1, consultarDisponibilidad("hotel", h))}
                          value={cantidad[`hotel-${h.id}`] || 1}
                          onChange={(e) =>
                            setCantidad((prev) => ({
                              ...prev,
                              [`hotel-${h.id}`]: e.target.value,
                            }))
                          }
                          disabled={
                            !h.disponible ||
                            consultarDisponibilidad("hotel", h) === 0
                          }
                        />
                      </label>
                      <button
                        type="button"
                        className="boton boton-oscuro"
                        disabled={
                          !h.disponible ||
                          consultarDisponibilidad("hotel", h) === 0
                        }
                        onClick={() => agregarOpcion("hotel", h)}
                      >
                        Añadir hotel
                      </button>
                    </div>
                  </article>
                ))
            ) : (
              <p>No hay hoteles para este destino.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
