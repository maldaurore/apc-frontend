import { useMemo } from "react";
import CITAS_POR_PROFESIONAL from "../../constants/citas";

// TODO: agregar funcion en context de Citas para filtrar por profesionalId y rango
// y usar esa funcion en vez de filtrar aca
export default function useCitasProfesional(profesionalId) {
  return useMemo(() => {
    if (!profesionalId) return [];
    const raw = CITAS_POR_PROFESIONAL[profesionalId] || [];
    return raw.map(ev => ({ ...ev, start: new Date(ev.start), end: new Date(ev.end) }));
  }, [profesionalId]);
}