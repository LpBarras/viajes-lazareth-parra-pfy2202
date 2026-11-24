import { Link, NavLink } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
export default function Navegacion() {
  const { unidades } = useCarrito();
  return (
    <header className="barra">
      <div className="contenedor barra-contenido">
        <Link to="/" className="marca">
          <span className="marca-icono"></span> Viaja<span>Fácil</span>
        </Link>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/destinos">Destinos</NavLink>
          <NavLink to="/carrito">Carrito ({unidades})</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
        </nav>
      </div>
    </header>
  );
}
