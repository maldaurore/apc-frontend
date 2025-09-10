function formatFechaHora(date) {
  try {
    const d = new Date(date);
    const opcionesFecha = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit" };
    const fecha = d.toLocaleDateString("es-MX", opcionesFecha);
    const hora = d.toLocaleTimeString("es-MX", opcionesHora);
    return { fecha, hora };
  } catch {
    return { fecha: "", hora: "" };
  }
}

export { formatFechaHora };