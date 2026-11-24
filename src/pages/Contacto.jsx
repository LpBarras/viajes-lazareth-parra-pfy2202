import { useState } from "react";
export default function Contacto() {
  const [enviado, setEnviado] = useState(false);
  function enviar(evento) {
    evento.preventDefault();
    setEnviado(true);
  }
  return (
    <section className="contenedor espacio contacto">
      <span className="eyebrow">ESTAMOS PARA AYUDARTE</span>
      <h1>Hablemos de tu próximo viaje</h1>
      <p>
        Completa este formulario 
      </p>
      <form onSubmit={enviar}>
        <label>
          Nombre
          <input required minLength="2" placeholder="Tu nombre" />
        </label>
        <label>
          Correo electrónico
          <input type="email" required placeholder="correo@ejemplo.com" />
        </label>
        <label>
          Mensaje
          <textarea
            required
            minLength="10"
            rows="5"
            placeholder="Cuéntanos qué destino te interesa"
          />
        </label>
        <button className="boton boton-oscuro" type="submit">
          Enviar mensaje
        </button>
        {enviado && (
          <p role="status" className="confirmacion">
            Formulario validado correctamente.
          </p>
        )}
      </form>
    </section>
  );
}
