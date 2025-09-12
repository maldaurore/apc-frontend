import { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [ auth, setAuth ] = useState({});
  const [ cargando, setCargando ] = useState(true);

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCargando(false);
        setAuth({});
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const { data } = await clienteAxios('/profesionales/perfil', config);
        setAuth(data.profesional);
      } catch (error) {
        console.error("Error al autenticar el usuario:", error);
        setAuth({});
      }
      setCargando(false);
    };
    autenticarUsuario();
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setAuth({});
  };

  const actualizarPerfil = async datos => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargando(false);
      setAuth({});
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const { data } = await clienteAxios.put(`/profesionales/perfil/${auth._id}`, datos, config);
      console.log("Perfil actualizado:", data);
      setAuth(data.profesional);

      return { msg: "Perfil actualizado correctamente" };
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      return { msg: "Error al actualizar el perfil", error: true };
    }
  }

  const guardarPassword = async datos => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCargando(false);
      setAuth({});
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      await clienteAxios.put(`/profesionales/actualizar-password/${auth._id}`, datos, config);
      return { msg: "Contraseña actualizada correctamente", error: false };
    } catch (error) {
      return { msg: error.response.data.msg, error: true };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        cargando,
        cerrarSesion,
        actualizarPerfil,
        guardarPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthProvider
}

export default AuthContext;