export default function MensajeError({ mensaje, reintentar }) {
  return (
    <div className="estado error" role="alert">
      <strong>No fue posible cargar la información</strong>
      <p>{mensaje}</p>
      {reintentar && (
        <button className="boton boton-oscuro" onClick={reintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
