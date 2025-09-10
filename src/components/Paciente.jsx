import usePacientes from "../hooks/usePacientes";

const Paciente = ({ paciente }) => {

  const { email, nombre, _id } = paciente;
  const { setEdicion, eliminarPaciente } = usePacientes();

  return (
    <div className="mx-5 my-10 bg-white shadow-md px-5 py-10 rounded-xl" >
      <p className="font-bold uppercase text-indigo-700 my-2">Nombre: {""}
        <span className="font-normal normal-case text-black">{nombre}</span>
      </p>
      <p className="font-bold uppercase text-indigo-700 my-2">Email: {""}
        <span className="font-normal normal-case text-black">{email}</span>
      </p>

      <div className="flex justify-between my-5" >
        <button
          type="button"
          className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white uppercase font-bolld rounded-lg hover:cursor-pointer"
          onClick={() => setEdicion(paciente)}
        >
          Editar
        </button>
        <button
          type="button"
          className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white uppercase font-bolld rounded-lg hover:cursor-pointer"
          onClick={() => eliminarPaciente(_id)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default Paciente;