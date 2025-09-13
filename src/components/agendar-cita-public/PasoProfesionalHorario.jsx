import MOTIVOS from "../../constants/motivos";
import PROFESIONALES from "../../constants/profesionales";
import Calendario from "../Calendario";
import Alerta from "../Alerta";
import useCitasProfesional from "../../hooks/agendar-cita/useCitasProfesional";
import useProfesionales from "../../hooks/useProfesionales";

export default function PasoProfesionalHorario({
  motivoId, profesionalId, onChangeProfesional, slot, onSelectSlot,
  onBack, onNext, canNext, alerta
}) {
  const { obtenerProfesionalesPorMotivo } = useProfesionales();
  const profesionales = obtenerProfesionalesPorMotivo(motivoId);
  console.log(profesionales)
  const citas = useCitasProfesional(profesionalId);
  const msg = alerta?.msg;

  return (
    <div>
      <h2 className="font-black text-3xl text-center">2) Elige profesional y horario</h2>
      <p className="text-center text-gray-600 mt-2">
        Solo mostramos profesionales que ofrecen “{MOTIVOS.find(m => m.id === motivoId)?.nombre}”
      </p>

      <div className="my-5">
        <label className="uppercase font-bold text-gray-600">Profesional</label>
        <select
          className="border bg-gray-50 w-full p-2 mt-3 rounded-lg"
          value={profesionalId}
          onChange={(e) => onChangeProfesional(e.target.value)}
        >
          <option value="">-- Selecciona profesional --</option>
          {profesionales.map(p => <option key={p.id} value={p._id}>{p.nombre}</option>)}
        </select>
      </div>

      {profesionalId && (
        <div className="mt-5">
          <h3 className="uppercase font-bold text-gray-600 mb-2">
            Agenda de {PROFESIONALES.find(p => p.id === profesionalId)?.nombre}
          </h3>

          <Calendario
            citas={citas}
            agregandoCita={true}
            selected={slot}
            onSelectSlot={onSelectSlot}
          />

          {slot && (
            <div className="mt-4 text-sm text-gray-700">
              <strong>Horario elegido: </strong>
              {new Date(slot.start).toLocaleString("es-MX")} — {new Date(slot.end).toLocaleString("es-MX")}
            </div>
          )}
        </div>
      )}

      {msg && <Alerta alerta={alerta} />}

      <div className="flex justify-between gap-3 mt-6">
        <button className="bg-gray-500 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-gray-600 cursor-pointer" onClick={onBack}>
          Atrás
        </button>
        <button
          className="bg-indigo-600 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={onNext}
          disabled={!canNext}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
