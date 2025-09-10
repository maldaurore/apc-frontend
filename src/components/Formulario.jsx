import { useEffect, useState } from "react";
import Alerta from "./Alerta";
import usePacientes from "../hooks/usePacientes";

const Formulario = () => {
  const [ nombre, setNombre ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ alerta, setAlerta ] = useState({});
  const [ id, setId ] = useState('');

  const { guardarPaciente, paciente } = usePacientes();

  useEffect(() => {
    if (paciente?.nombre) {
      setNombre(paciente.nombre);
      setEmail(paciente.email);
      setId(paciente._id);
    }
  }, [paciente])

  const handleSubmit = e => {
    e.preventDefault();

    // Validar formulario
    if ([nombre, email].includes('')) {
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      });
      return;
    }

    // Pasar los datos al componente padre
    setAlerta({
      msg: 'Paciente agregado correctamente',
      error: false
    });

    guardarPaciente({ nombre, email, id });
    setAlerta({
      msg: 'Paciente guardado correctamente',
      error: false
    });
    setNombre('');
    setEmail('');
    setId('');
  }

  const { msg } = alerta;

  return (
    <>
      <h2 className="font-black text-3xl text-center" >Administrador de Pacientes</h2>
      <p 
        className="text-xl mt-5 mb-10 text-center "
      >
        Añade tus pacientes y {""}
        <span className="text-indigo-600 font-bold" >adminístralos</span>
      </p>

      <form
        className="bg-white py-10 px-5 mb-10 lg:mb-0 shadow-md rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-5" >
          <label 
            htmlFor="paciente"
            className="text-gray-700 uppercase font-bold"
          >
            Nombre paciente
          </label>
          <input
            id="paciente"
            type="text"
            placeholder="Nombre del paciente"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-5" >
          <label 
            htmlFor="email"
            className="text-gray-700 uppercase font-bold"
          >
            Email del paciente
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email del paciente"
            className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value={id? "Guardar cambios" : "Agregar paciente"}
          className="bg-indigo-600 w-full p-3 text-white uppercase font-bold hover:bg-indigo-700 cursor-pointer transition-colors rounded-md"
        />
      </form>
      {msg && <Alerta alerta={alerta} />}
    </>
    
  )
}

export default Formulario;