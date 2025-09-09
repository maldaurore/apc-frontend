import { createContext, useEffect, useState } from "react"
import useAuth from "../hooks/useAuth";
import clienteAxios from "../config/axios";

const CitasContext = createContext();

const toRbcEvent = (c) => ({
  ...c,
  id: c._id,
  start: c.start ? new Date(c.start) : null,
  end:   c.end   ? new Date(c.end)   : null,
});

export const CitasProvider = ({ children }) => {
  const [citas, setCitas] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        };

        const { data } = await clienteAxios('/citas', config);
        setCitas(Array.isArray(data) ? data.map(toRbcEvent) : []);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerCitas();
  }, [auth]);

  const guardarCita = async (cita) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    if (cita.id) {
      try {
        const { data } = await clienteAxios.put(`/citas/${cita.id}`, cita, config);
        const citaNormalizada = toRbcEvent(data);
        setCitas(prev =>
          prev.map(c => (c._id === citaNormalizada._id ? citaNormalizada : c))
        );
      } catch (error) {
        console.log(error);

      }
    } else {
      try {
        const { data } = await clienteAxios.post('/citas', cita, config);
        const citaNormalizada = toRbcEvent(data);
        setCitas([...citas, citaNormalizada]);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <CitasContext.Provider
      value={{
        citas,
        guardarCita,
      }}
    >
      {children}
    </CitasContext.Provider>
  )
}

export default CitasContext;