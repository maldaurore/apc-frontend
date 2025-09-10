import MOTIVOS_MOCK from "../../constants/motivos";
import Alerta from "../Alerta";

export default function PasoMotivo({ motivoId, onChangeMotivo, onNext, canNext, alerta }) {
  const msg = alerta?.msg;

  return (
    <div>
      <h2 className="font-black text-3xl text-center">1) Agenda tu cita</h2>
      <p className="text-center text-gray-600 mt-2">Selecciona el motivo de tu cita</p>

      <div className="my-5">
        <label className="uppercase font-bold text-gray-600">Motivo / Servicio</label>
        <select
          className="border bg-gray-50 w-full p-2 mt-3 rounded-lg"
          value={motivoId}
          onChange={(e) => onChangeMotivo(e.target.value)}
        >
          <option value="">-- Selecciona un motivo --</option>
          {MOTIVOS_MOCK.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      {msg && <Alerta alerta={alerta} />}

      <div className="flex justify-end gap-3 mt-6">
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
