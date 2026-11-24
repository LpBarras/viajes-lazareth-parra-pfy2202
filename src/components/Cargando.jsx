export default function Cargando({ mensaje = "Cargando información..." }) {
  return (
    <div className="estado" role="status">
      <div className="spinner" aria-hidden="true" />
      <p>{mensaje}</p>
    </div>
  );
}