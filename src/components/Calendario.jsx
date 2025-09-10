import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en'
import lang from '../config/lang';

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

const Calendario = ({ citas, agregandoCita, selected, onSelectSlot }) => {
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

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
        if (!agregandoCita) return;     // solo permitir seleccionar si se está agregando una cita
        onSelectSlot({ start, end });
      }
    },
    [view, agregandoCita, onSelectSlot],
  )

  return (
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
  )
}

export default Calendario;