import { useEffect, useState } from "react";
import TarjetaDestino from "../components/TarjetaDestino";
import Cargando from "../components/Cargando";
import MensajeError from "../components/MensajeError";

export default function Destinos() {
  const [destinos, setDestinos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [region, setRegion] = useState("Todas");
  const [intento, setIntento] = useState(0);

  // useeffect consulta el servicio rest al entrar a esta pagina
  useEffect(() => {
    const controlador = new AbortController();
    async function cargarDestinos() {
      setCargando(true);
      setError("");
      try {
        const respuesta = await fetch(
          `${import.meta.env.BASE_URL}api/destinos`,
          { signal: controlador.signal },
        );
        if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);
        const tipo = respuesta.headers.get("content-type") || "";
        if (!tipo.includes("application/json"))
          throw new Error(
//cuando al api no responde con json, hay que comprobar que msw activo y recargar
            "La API REST no respondió",
          );
        const datos = await respuesta.json();
        setDestinos(datos);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        if (!controlador.signal.aborted) setCargando(false);
      }
    }
    cargarDestinos();
    return () => controlador.abort();
  }, [intento]);

  // Los filtros trabajan con los datos obtenidos de la api rest
  const filtrados = destinos.filter((destino) => {
    const coincideTexto =
      `${destino.ciudad} ${destino.pais} ${destino.actividades.join(" ")}`
        .toLowerCase()
        .includes(busqueda.toLowerCase());
    return coincideTexto && (region === "Todas" || destino.region === region);
  });
  return (
    <section className="contenedor espacio">
      <div className="cabecera-pagina">
        <span className="eyebrow">EXPLORA EL MUNDO</span>
        <h1>Encuentra tu próximo destino</h1>
        <p>Elige un lugar y descubre las experiencias que te esperan.</p>
      </div>
      <div className="filtros">
        <label className="sr-only" htmlFor="buscar">
          Buscar destino
        </label>
        <input
          id="buscar"
          type="search"
          placeholder="Buscar ciudad, país o actividad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <label className="sr-only" htmlFor="region">
          Filtrar por región
        </label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {["Todas", "Sudamérica", "Europa", "Asia", "Norteamérica"].map(
            (op) => (
              <option key={op}>{op}</option>
            ),
          )}
        </select>
      </div>
      {cargando ? (
        <Cargando mensaje="Consultando destinos..." />
      ) : error ? (
        <MensajeError
          mensaje={error}
          reintentar={() => setIntento((n) => n + 1)}
        />
      ) : filtrados.length ? (
        <div className="grilla">
          {filtrados.map((destino) => (
            <TarjetaDestino key={destino.id} destino={destino} />
          ))}
        </div>
      ) : (
        <div className="estado">No encontramos destinos con esos filtros.</div>
      )}
    </section>
  );
}
