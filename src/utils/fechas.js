// se utilizan fehcas de esta semana luego de la entrega, sin depender de UTC.
export function fechasSemana() {
  const hoy = new Date();
  const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
  return Array.from({ length: 5 }, (_, indice) => {
    const dia = new Date(lunes);
    dia.setDate(lunes.getDate() + indice + 1);
    const valor = `${dia.getFullYear()}-${String(dia.getMonth() + 1).padStart(2, "0")}-${String(dia.getDate()).padStart(2, "0")}`;
    return {
      valor,
      etiqueta: dia.toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    };
  });
}
