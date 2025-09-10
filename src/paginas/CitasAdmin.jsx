import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en'
import ClientSearchInput from '../components/SearchInput';
import useCitas from '../hooks/useCitas';
import Calendario from '../components/Calendario';

const CitasAdmin = () => {
  const [agregandoCita, setAgregandoCita] = useState(false);
  const [selected, setSelected] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const { citas, guardarCita } = useCitas();

  const handleAgregarCita = () => {
    if (agregandoCita) {
      setSelected(null);
      setPaciente(null);
    } 
    setAgregandoCita(!agregandoCita);
  }

  const handleCancelar = () => {
    setSelected(null);
    setPaciente(null);
    setAgregandoCita(false);
  }

  const handleGuardar = () => {
    const nuevaCita = {
      pacienteId: paciente._id,
      start: selected.start,
      end: selected.end,
    }
    guardarCita(nuevaCita);
    setSelected(null);
    setPaciente(null);
    setAgregandoCita(false);
  }

  return (
    <div className='w-full'>

      <div>
        <h1 className='text-4xl font-bold text-center mt-3'>Citas</h1>
        <div className='flex justify-center'>
          <button
              value="Iniciar Sesión"
              className="bg-indigo-700 w-full py-3 px-10 rounded-xl text-white 
              uppercase font-bold mt-5 hover:cursor-pointer hover:bg-indigo-800 md:w-auto
              mb-5"
              onClick={handleAgregarCita}
            >
              {agregandoCita ? 'Cancelar' : 'Agregar Cita'}            
            </button>
        </div>
      </div>

      {agregandoCita && (
        <div>
          <div className='text-center mb-5' >
            <h2 className='text-2xl font-bold'>Agendando cita</h2>
          </div>
          <div className='mb-5'>
            <label
              htmlFor="paciente"
              className="text-gray-700 uppercase font-bold"
            >
              Paciente
            </label>
            <ClientSearchInput onSelect={setPaciente} /> 
          </div>

          <p className='text-gray-700 uppercase font-bold mb-5'>Seleccione una fecha y hora:</p>

        </div>
      )}
      <div className='h-[500px]' >
        <Calendario
          citas={citas}
          agregandoCita={agregandoCita}
          selected={selected}
          onSelectSlot={setSelected}
        />
      </div>
      {(selected && paciente) && (
        <div className='mt-5' >
          <h2 className='text-2xl font-bold'>Detalles de la cita</h2>
          <div>
            <p><strong>Paciente:</strong> {paciente.nombre}</p>
            <p><strong>Fecha:</strong> {dayjs(selected.start).format('DD/MM/YYYY')}</p>
            <p><strong>Hora:</strong> {dayjs(selected.start).format('HH:mm')} - {dayjs(selected.end).format('HH:mm')}</p>
          </div>
          <div className='flex justify-center gap-3' >
            <button
              className='bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 hover:cursor-pointer'
              onClick={handleCancelar}
            >
              Cancelar
            </button>
            <button
              className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 hover:cursor-pointer'
              onClick={handleGuardar}
            >
              Guardar cita
            </button>
          </div>
        </div>  
      )}
    </div>
  )
}

export default CitasAdmin;