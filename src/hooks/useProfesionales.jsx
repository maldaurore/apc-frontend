import { useContext } from "react"
import ProfesionalesContext from "../context/ProfesionalesProvider";

const useProfesionales = () => {
  return useContext(ProfesionalesContext)
}

export default useProfesionales;