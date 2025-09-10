import MOTIVOS_MOCK from "../../constants/motivos";
import PROFESIONALES_MOCK from "../../constants/profesionales";
import Alerta from "../Alerta";

export default function PasoDatosConfirmacion({
  motivoId, profesionalId, resumen, email, setEmail, verificado, paciente,
  nombre, setNombre, onVerificar, onBack, onConfirmar, confirmacion, alerta
}) {
  if (confirmacion) {
    return (
      <div className="text-center">
        <h2 className="font-black text-3xl">¡Todo listo!</h2>
        <p className="mt-4 text-gray-700">
          <span className="font-semibold">{confirmacion.nombre}</span>, tu cita está agendada para el día{" "}
          <span className="font-semibold">{confirmacion.fecha}</span> a la(s){" "}
          <span className="font-semibold">{confirmacion.hora}</span>.
        </p>
      </div>
    );
  }

  const motivoTexto = MOTIVOS_MOCK.find(m => m.id === motivoId)?.nombre || "";
  const profesionalTexto = PROFESIONALES_MOCK.find(p => p.id === profesionalId)?.nombre || "";
  const msg = alerta?.msg;

  return (
    <div>
      <h2 className="font-black text-3xl text-center">3) Datos y confirmación</h2>
      <p className="text-center text-gray-600 mt-2">Completa tus datos para confirmar</p>

      <div className="bg-gray-50 border rounded-lg p-4 mt-5 text-sm text-gray-700">
        <p><strong>Motivo:</strong> {motivoTexto}</p>
        <p><strong>Profesional:</strong> {profesionalTexto}</p>
        <p><strong>Fecha:</strong> {resumen.fecha || "—"} <strong>Hora:</strong> {resumen.hora || "—"}</p>
      </div>

      <div className="my-4">
        <label className="uppercase font-bold text-gray-600">Correo electrónico</label>
        <div className="flex gap-2 mt-3">
          <input
            type="email"
            className="border bg-gray-50 w-full p-2 rounded-lg"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" onClick={() => onVerificar(email)}
            className="bg-slate-700 px-4 py-2 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Verificar
          </button>
        </div>

        {verificado && paciente && (
          <p className="text-green-600 text-sm mt-2">
            Paciente encontrado: <strong>{paciente.nombre}</strong>. No es necesario ingresar tu nombre.
          </p>
        )}
        {verificado && !paciente && (
          <p className="text-amber-600 text-sm mt-2">
            No encontramos un paciente con ese correo. Por favor ingresa tu nombre para registrarte.
          </p>
        )}
      </div>

      {!paciente && (
        <div className="my-4">
          <label className="uppercase font-bold text-gray-600">Nombre completo</label>
          <input
            type="text"
            className="border bg-gray-50 w-full p-2 mt-3 rounded-lg"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!verificado}
          />
        </div>
      )}

      {msg && <Alerta alerta={alerta} />}

      <div className="flex justify-between gap-3 mt-6">
        <button className="bg-gray-500 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-gray-600 cursor-pointer" onClick={onBack}>
          Atrás
        </button>
        <button className="bg-indigo-600 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-indigo-700 cursor-pointer" onClick={onConfirmar}>
          Confirmar y agendar
        </button>
      </div>
    </div>
  );
}
