import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en'
import ClientSearchInput from '../components/SearchInput';
import useCitas from '../hooks/useCitas';
const lang = {
  en: {
    week: 'Week',
    work_week: 'Work week',
    day: 'Day',
    month: 'Month',
    previous: 'Back',
    next: 'Next',
    today: 'Today',
    agenda: 'Agenda',
    showMore: (total) => `+${total} more`,
  },
  es: {
    week: 'Semana',
    work_week: 'Semana de trabajo',
    day: 'Día',
    month: 'Mes',
    previous: 'Atrás',
    next: 'Siguiente',
    today: 'Hoy',
    agenda: 'Agenda',
    showMore: (total) => `+${total} más`,
  },
}

dayjs.locale('es');
const djlocalizer = dayjsLocalizer(dayjs);

function makeTimeSlotWrapper(selected) {
  return function TimeSlotWrapper({ value, children }) {
    const isSelected = selected && value >= selected.start && value < selected.end;

    const extraClasses = isSelected ? ' bg-indigo-100 ring-2 ring-indigo-400/60 rounded-sm'
    : '';

    return React.cloneElement(children, {
      className: (children.props.className || "") + extraClasses,
    });
  };
}

const CitasAdmin = () => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [agregandoCita, setAgregandoCita] = useState(false);
  const [selected, setSelected] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const { citas, guardarCita } = useCitas();

  const eventStyleGetter = useCallback((event, start, end, isSelected) => {
    const bg = isSelected ? "#4338ca" : "#4f46e5"; // indigo-700 / indigo-600
    const border = "#3730a3";                      // indigo-800
    return {
      className: "text-white shadow-sm rounded-md hover:opacity-95",
      style: {
        backgroundColor: bg,
        borderColor: border,
      },
    };
  }, []);

  const culture = useMemo(() => {
    const navLang = typeof navigator !== 'undefined' ? navigator.language : 'en'
    return navLang.toLowerCase().startsWith('es') ? 'es' : 'en'
  }, []);

  useEffect(() => {
    dayjs.locale(culture)
  }, [culture]);

  const { messages, min, max, components } = useMemo(
    () => ({
      messages: lang[culture],
      min: new Date(1970, 1, 1, 8, 0, 0),
      max: new Date(1970, 1, 1, 18, 0),
      components: {
        timeSlotWrapper: makeTimeSlotWrapper(selected),
      }
    }), [culture, selected]);

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      if (view === Views.MONTH) {
        setView(Views.DAY);
        setDate(start);
        return;
      } else {
        if (start < new Date()) return; // no permitir citas en el pasado
        if (!agregandoCita) return; // solo permitir seleccionar si se está agregando una cita
        setSelected({ start, end });
      }
    },
    [view, agregandoCita],
  )

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
        <Calendar
          localizer={djlocalizer}
          view={view}
          culture={culture}
          messages={messages}
          min={min}
          max={max}
          onView={(v)=>setView(v)}
          onNavigate={(d)=>setDate(d)}
          date={date}
          step={60}
          timeslots={1}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          components={components}
          events={citas}
          eventPropGetter={eventStyleGetter}
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