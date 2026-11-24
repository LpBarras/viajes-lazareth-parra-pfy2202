import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext(null);
const CLAVE = "viajafacil-carrito-v1";

export function CarritoProvider({ children }) {
  // Recuperamos la selección al volver a abrir el navegador
  const [carrito, setCarrito] = useState(() => {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE) || "[]");
      return Array.isArray(datos)
        ? datos.filter(
            (x) =>
              x &&
              ["vuelo", "hotel"].includes(x.tipo) &&
              Number.isInteger(x.cantidad) &&
              x.cantidad > 0,
          )
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
  }, [carrito]);
  // Calcula cuantas unidades de una opcion y fecha estan actualmente agregadas al carrito.
function obtenerCantidadEnCarrito(tipo, id, fecha) {
  return carrito
    .filter(
      (item) =>
        item.tipo === tipo &&
        item.id === id &&
        item.fecha === fecha
    )
    .reduce((total, item) => total + item.cantidad, 0)
}

// Calcula el stock restante descontando lo que este en carrito
function obtenerStockDisponible(tipo, id, fecha, stockTotal) {
  const cantidadReservada = obtenerCantidadEnCarrito(
    tipo,
    id,
    fecha
  )

  return Math.max(0, stockTotal - cantidadReservada)
}

  // Cada vuelo y hotel se guarda con su precio y disponibilidad simulada
  function agregar(item, cantidad = 1) {
    const unidades = Number(cantidad);
    if (!Number.isInteger(unidades) || unidades < 1) return false;
    const maximo = Number(item.maximo) || 0;
    const actual =
      carrito.find((x) => x.clave === `${item.tipo}-${item.id}-${item.fecha}`)
        ?.cantidad || 0;
    if (maximo < actual + unidades) return false;
    setCarrito((lista) => {
      const clave = `${item.tipo}-${item.id}-${item.fecha}`;
      const existe = lista.find((x) => x.clave === clave);
      if (existe)
        return lista.map((x) =>
          x.clave === clave ? { ...x, cantidad: x.cantidad + unidades } : x,
        );
      return [...lista, { ...item, clave, cantidad: unidades }];
    });
    return true;
  }
  function cambiarCantidad(clave, cantidad) {
    setCarrito((lista) =>
      lista.map((x) =>
        x.clave === clave
          ? { ...x, cantidad: Math.max(1, Math.min(x.maximo, cantidad)) }
          : x,
      ),
    );
  }
  function eliminar(clave) {
    setCarrito((lista) => lista.filter((x) => x.clave !== clave));
  }
  function vaciar() {
    setCarrito([]);
  }
  const unidades = carrito.reduce((s, x) => s + x.cantidad, 0);
  const total = carrito.reduce((s, x) => s + x.cantidad * x.precio, 0);
return (
  <CarritoContext.Provider
    value={{
      carrito,
      agregar,
      cambiarCantidad,
      eliminar,
      vaciar,
      unidades,
      total,
      obtenerCantidadEnCarrito,
      obtenerStockDisponible
    }}
  >
    {children}
  </CarritoContext.Provider>
);
}
export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto) throw new Error("useCarrito requiere CarritoProvider");
  return contexto;
}
