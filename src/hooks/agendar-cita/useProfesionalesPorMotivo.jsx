import { useMemo } from "react";
import PROFESIONALES_MOCK from "../../constants/profesionales";

// TODO: Cambiar este mock por el hook que traiga los profesionales del context
export default function useProfesionalesPorMotivo(motivoId) {
  return useMemo(() => {
    if (!motivoId) return [];
    return PROFESIONALES_MOCK.filter(p => p.servicios.includes(motivoId));
  }, [motivoId])
}