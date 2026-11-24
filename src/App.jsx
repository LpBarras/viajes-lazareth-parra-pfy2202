import { Routes, Route } from "react-router-dom";
import Navegacion from "./components/Navegacion";
import PiePagina from "./components/PiePagina";
import Inicio from "./pages/Inicio";
import Destinos from "./pages/Destinos";
import DetalleDestino from "./pages/DetalleDestino";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";

// React Router pARA navegar sin recargar la página.
export default function App() {
  return (
    <div className="aplicacion">
      <Navegacion />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/destinos" element={<Destinos />} />
          <Route path="/destinos/:id" element={<DetalleDestino />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="*"
            element={
              <section className="contenedor espacio">
                <h1>Página no encontrada</h1>
                <p>La dirección que buscas no existe.</p>
              </section>
            }
          />
        </Routes>
      </main>
      <PiePagina />
    </div>
  );
}
