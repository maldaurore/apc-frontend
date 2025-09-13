import { createContext, useEffect, useState } from 'react';
import clienteAxios from "../config/axios";

const ProfesionalesContext = createContext();

export const ProfesionalesProvider = ({ children }) => {
  const [ profesionales, setProfesionales ] = useState([]);
  
  useEffect(() => {
    const obtenerProfesionales = async () => {
      try {

        const config = {
          headers: {
            'Content-Type': 'application/json',
          }
        };

        const { data } = await clienteAxios('/profesionales', config);
        setProfesionales(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProfesionales();
  }, []);

  const obtenerProfesionalesPorMotivo = (motivo) => {
    return profesionales.filter(profesional => profesional.servicios.includes(motivo));
  }

  return (
    <ProfesionalesContext.Provider 
      value={{ 
        profesionales,
        obtenerProfesionalesPorMotivo
      }}
    >
      {children}
    </ProfesionalesContext.Provider>
  )
};

export default ProfesionalesContext;