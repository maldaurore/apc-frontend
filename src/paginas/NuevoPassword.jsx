import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../config/axios";
import Alerta from "../components/Alerta";

const NuevoPassword = () => {
  const [ password, setPassword ] = useState('');
  const [ alerta, setAlerta ] = useState({});
  const [ tokenValido, setTokenValido ] = useState(false);
  const [ passwordModificado, setPasswordModificado ] = useState(false);
  const { token } = useParams();

  useEffect(() => {
    const validarToken = async () => {
      try {
        const url = `/profesionales/olvide-password/${token}`;
        await clienteAxios(url);
        setAlerta({
          msg: 'Coloca tu nueva contraseña',
          error: false
        });
        setTokenValido(true);
      } catch (error) {
        console.error("Error al validar el token:", error.response.data.msg);
        setAlerta({
          msg: 'Hubo un error con el enlace',
          error: true
        });
      }
    };
    validarToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setAlerta({
        msg: 'La contraseña debe tener al menos 6 caracteres',
        error: true
      });
      return;
    }

    try {
      const url = `/profesionales/olvide-password/${token}`
      const { data } = await clienteAxios.post(url, { password });

      setAlerta({
        msg: data.msg,
        error: false
      });
      setPasswordModificado(true);
    } catch (error) {
      setAlerta({
        msg: error.response.data.msg,
        error: true
      })
    }
  }

  const { msg } = alerta;

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl" >
          Restablece tu contraseña y no pierdas acceso a tus <span className="text-black" >Pacientes</span>
        </h1>
      </div>

      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white" >
        {msg && (
          <Alerta alerta={alerta} />
        )}

        {tokenValido && (
          <>
            <form onSubmit={handleSubmit} >
              <div className="my-5" >
                <label className="uppercase text-gray-600 bloxk text-xl font-bold" >
                  Contraseña
                </label>
                <input 
                  type="password" 
                  placeholder="Tu nueva contraseña"
                  className="border w-full p-3 mt-3 bg-gray-50 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <input
                type="submit"
                value="Guardar contraseña"
                className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 md:w-auto"
              />
            </form>
            {passwordModificado && (
              <Link
                to="/"
                className="block text-center my-5 text-gray-500"
              >
                  Inicia Sesión
              </Link>
            )}
          </>
        )}
      </div>
    </>
  )
};

export default NuevoPassword;