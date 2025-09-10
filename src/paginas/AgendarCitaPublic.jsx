import { useMemo, useState } from "react";
import Alerta from "../components/Alerta";
import usePacientes from "../hooks/usePacientes";
import Calendario from "../components/Calendario";
import useCitas from "../hooks/useCitas";

// ---- MOCKS ----

// Motivos (servicios) para un consultorio dental
const MOTIVOS_MOCK = [
  { id: "limpieza", nombre: "Limpieza dental" },
  { id: "extraccion", nombre: "Extracción" },
  { id: "ortodoncia", nombre: "Consulta de Ortodoncia" },
  { id: "blanqueamiento", nombre: "Blanqueamiento" },
  { id: "urgencias", nombre: "Dolor de muela (Urgencias)" },
];

// Profesionales con servicios ofrecidos
const PROFESIONALES_MOCK = [
  {
    id: "perez",
    nombre: "Dr. Juan Pérez",
    servicios: ["limpieza", "blanqueamiento"],
  },
  {
    id: "ruiz",
    nombre: "Dra. Ana Ruiz (Ortodoncista)",
    servicios: ["limpieza", "ortodoncia"],
  },
  {
    id: "gomez",
    nombre: "Dr. Luis Gómez",
    servicios: ["extraccion", "urgencias", "limpieza"],
  },
];

// Citas existentes por profesional (bloqueos/ocupadas)
const CITAS_POR_PROFESIONAL = {
  perez: [
    {
      id: "c1",
      title: "Ocupado",
      start: "2025-09-10T16:00:00.000Z",
      end: "2025-09-10T17:00:00.000Z",
      createdAt: "2025-09-08T22:52:57.529Z",
      updatedAt: "2025-09-08T22:52:57.529Z",
    },
  ],
  ruiz: [
    {
      id: "c2",
      title: "Ocupado",
      start: "2025-09-11T18:00:00.000Z",
      end: "2025-09-11T19:00:00.000Z",
      createdAt: "2025-09-08T22:52:57.529Z",
      updatedAt: "2025-09-08T22:52:57.529Z",
    },
  ],
  gomez: [
    {
      id: "c3",
      title: "Ocupado",
      start: "2025-09-12T15:00:00.000Z",
      end: "2025-09-12T16:00:00.000Z",
      createdAt: "2025-09-08T22:52:57.529Z",
      updatedAt: "2025-09-08T22:52:57.529Z",
    },
  ],
};

// ---- UTILS ----
function formatFechaHora(date) {
  try {
    const d = new Date(date);
    const opcionesFecha = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const opcionesHora = { hour: "2-digit", minute: "2-digit" };
    const fecha = d.toLocaleDateString("es-MX", opcionesFecha);
    const hora = d.toLocaleTimeString("es-MX", opcionesHora);
    return { fecha, hora };
  } catch {
    return { fecha: "", hora: "" };
  }
}

const PasoIndicator = ({ step }) => {
  const steps = [
    { id: 1, label: "Motivo" },
    { id: 2, label: "Profesional y horario" },
    { id: 3, label: "Datos y confirmación" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {steps.map((s) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={[
              "w-8 h-8 rounded-full flex items-center justify-center font-bold",
              step === s.id
                ? "bg-indigo-600 text-white"
                : step > s.id
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700",
            ].join(" ")}
            title={s.label}
          >
            {s.id}
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-gray-700">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

const AgendarCitaPublic = () => {
  const [step, setStep] = useState(1);
  const [alerta, setAlerta] = useState({});
  const { msg } = alerta;
  const [motivoId, setMotivoId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [verificado, setVerificado] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const { verificarCorreo, guardarPaciente } = usePacientes();
  const { guardarCita } = useCitas();

  // Profesionales filtrados por motivo
  const profesionalesDisponibles = useMemo(() => {
    if (!motivoId) return [];
    return PROFESIONALES_MOCK.filter((p) => p.servicios.includes(motivoId));
  }, [motivoId]);

  // Citas del profesional seleccionado
  const citasProfesional = useMemo(() => {
  if (!profesionalId) return [];
  const raw = CITAS_POR_PROFESIONAL[profesionalId] || [];
  return raw.map(ev => ({
    ...ev,
    start: new Date(ev.start),
    end: new Date(ev.end),
  }));
}, [profesionalId]);


  // Handlers de navegación
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  // Validaciones por paso
  const canNextStep1 = !!motivoId;
  const canNextStep2 = !!profesionalId && !!slotSeleccionado;

  // ---- Paso 1: elegir motivo ----
  const handleSelectMotivo = (e) => {
    setMotivoId(e.target.value);

    setProfesionalId("");
    setSlotSeleccionado(null);
  };

  // ---- Paso 2: elegir profesional y ranura ----
  const handleSelectProfesional = (e) => {
    setProfesionalId(e.target.value);
    setSlotSeleccionado(null);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSlotSeleccionado({ start, end });
  };

  // ---- Paso 3: verificación + registro + agendar ----
  const handleVerificarCorreo = async () => {
    setAlerta({});
    if (!email) {
      setAlerta({ msg: "El correo electrónico es obligatorio", error: true });
      return;
    }
    try {
      const paciente = await verificarCorreo(email);
      setPacienteEncontrado(paciente || null);
      setVerificado(true);
      if (paciente) setNombre(paciente.nombre || "");
    } catch (error) {
      setPacienteEncontrado(null);
      setVerificado(true);
      setAlerta({
        msg:
          error?.message ||
          "No encontramos un paciente con ese correo. Por favor ingresa tu nombre para registrarte.",
        error: true,
      });
    }
  };

  const handleAgendar = () => {
    setAlerta({});
    if (!email) {
      setAlerta({ msg: "El correo es obligatorio para confirmar la cita", error: true });
      return;
    }
    if (!verificado) {
      setAlerta({ msg: "Primero verifica tu correo.", error: true });
      return;
    }
    if (!pacienteEncontrado && !nombre.trim()) {
      setAlerta({ msg: "Ingresa tu nombre completo.", error: true });
      return;
    }
    if (!slotSeleccionado) {
      setAlerta({ msg: "Selecciona fecha y hora en el calendario.", error: true });
      return;
    }

    // Simulación de:
    // 1) registrar paciente si no existe
    // 2) registrar cita

    if (pacienteEncontrado) {
      const citaData = {
        pacienteId: pacienteEncontrado._id,
        title: pacienteEncontrado.nombre,
        start: slotSeleccionado.start,
        end: slotSeleccionado.end,
      };
      guardarCita(citaData);
    } else {
      const nuevoPaciente = { nombre: nombre.trim(), email  };
      guardarPaciente(nuevoPaciente).then((pacienteGuardado) => {
        const citaData = {
          pacienteId: pacienteGuardado._id,
          title: pacienteGuardado.nombre,
          start: slotSeleccionado.start,
          end: slotSeleccionado.end,
        };
        guardarCita(citaData);
      });
    }
      
    const nombreParaMensaje = pacienteEncontrado?.nombre || nombre.trim();
    const { fecha, hora } = formatFechaHora(slotSeleccionado.start);

    setConfirmacion({
      nombre: nombreParaMensaje,
      fecha,
      hora,
    });

    // TO DO:
    // - POST /pacientes (si !pacienteEncontrado)
    // - POST /citas con { motivoId, profesionalId, slotSeleccionado, pacienteId/email, telefono }
    // - Mostrar confirmación real de tu API
  };

  // ---- Renders por paso ----
  const renderStep = () => {
    const motivoTexto = MOTIVOS_MOCK.find((m) => m.id === motivoId)?.nombre || "";
    const profesionalTexto = PROFESIONALES_MOCK.find((p) => p.id === profesionalId)?.nombre || "";
    const { fecha, hora } = slotSeleccionado
      ? formatFechaHora(slotSeleccionado.start)
      : { fecha: "", hora: "" };

    switch (step) {
      case 1:
        return (
          <>
            <div>
              <h2 className="font-black text-3xl text-center">Agenda tu cita</h2>
              <p className="text-center text-gray-600 mt-2">1) Selecciona el motivo de tu cita</p>

              <div className="my-5">
                <label className="uppercase font-bold text-gray-600">Motivo / Servicio</label>
                <select
                  className="border bg-gray-50 w-full p-2 mt-3 rounded-lg"
                  value={motivoId}
                  onChange={handleSelectMotivo}
                >
                  <option value="">-- Selecciona un motivo --</option>
                  {MOTIVOS_MOCK.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {msg && <Alerta alerta={alerta} />}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="bg-indigo-600 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-indigo-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={next}
                  disabled={!canNextStep1}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div>
              <h2 className="font-black text-3xl text-center">Elige profesional y horario</h2>
              <p className="text-center text-gray-600 mt-2">
                Solo mostramos profesionales que ofrecen “
                {MOTIVOS_MOCK.find((m) => m.id === motivoId)?.nombre}
                ”
              </p>

              <div className="my-5">
                <label className="uppercase font-bold text-gray-600">Profesional</label>
                <select
                  className="border bg-gray-50 w-full p-2 mt-3 rounded-lg"
                  value={profesionalId}
                  onChange={handleSelectProfesional}
                >
                  <option value="">-- Selecciona profesional --</option>
                  {profesionalesDisponibles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {profesionalId && (
                <div className="mt-5">
                  <h3 className="uppercase font-bold text-gray-600 mb-2">
                    Agenda de {PROFESIONALES_MOCK.find((p) => p.id === profesionalId)?.nombre}
                  </h3>

                  <Calendario
                    citas={citasProfesional}
                    agregandoCita={true}
                    selected={slotSeleccionado}
                    onSelectSlot={handleSelectSlot}
                  />

                  {slotSeleccionado && (
                    <div className="mt-4 text-sm text-gray-700">
                      <strong>Horario elegido: </strong>
                      {new Date(slotSeleccionado.start).toLocaleString("es-MX")}
                      {" — "}
                      {new Date(slotSeleccionado.end).toLocaleString("es-MX")}
                    </div>
                  )}
                </div>
              )}

              {msg && <Alerta alerta={alerta} />}

              <div className="flex justify-between gap-3 mt-6">
                <button
                  className="bg-gray-500 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-gray-600"
                  onClick={back}
                >
                  Atrás
                </button>
                <button
                  className="bg-indigo-600 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={next}
                  disabled={!canNextStep2}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        );
      case 3:
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

        return (
          <div>
            <h2 className="font-black text-3xl text-center">Datos y confirmación</h2>
            <p className="text-center text-gray-600 mt-2">3) Completa tus datos para confirmar</p>

            <div className="bg-gray-50 border rounded-lg p-4 mt-5 text-sm text-gray-700">
              <p>
                <strong>Motivo:</strong> {motivoTexto}
              </p>
              <p>
                <strong>Profesional:</strong> {profesionalTexto}
              </p>
              <p>
                <strong>Fecha:</strong> {fecha || "—"} <strong>Hora:</strong> {hora || "—"}
              </p>
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
                <button
                  type="button"
                  onClick={handleVerificarCorreo}
                  className="bg-slate-700 px-4 py-2 text-white rounded-lg font-semibold hover:bg-slate-800"
                >
                  Verificar
                </button>
              </div>
              {verificado && pacienteEncontrado && (
                <p className="text-green-600 text-sm mt-2">
                  Paciente encontrado: <strong>{pacienteEncontrado.nombre}</strong>. No es necesario ingresar tu nombre.
                </p>
              )}
              {verificado && !pacienteEncontrado && (
                <p className="text-amber-600 text-sm mt-2">
                  No encontramos un paciente con ese correo. Por favor ingresa tu nombre para registrarte.
                </p>
              )}
            </div>

            {!pacienteEncontrado && (
              <div className="my-4">
                <label className="uppercase font-bold text-gray-600">Nombre completo</label>
                <input
                  type="text"
                  className="border bg-gray-50 w-full p-2 mt-3 rounded-lg"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  disabled={!verificado} // solo si ya verificó el correo
                />
              </div>
            )}

            {msg && <Alerta alerta={alerta} />}

            <div className="flex justify-between gap-3 mt-6">
              <button
                className="bg-gray-500 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-gray-600"
                onClick={back}
              >
                Atrás
              </button>
              <button
                className="bg-indigo-600 px-6 py-3 font-bold text-white rounded-lg uppercase hover:bg-indigo-700"
                onClick={handleAgendar}
              >
                Confirmar y agendar
              </button>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-center items-start w-full py-5">
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white shadow rounded-lg p-5">
          <PasoIndicator step={step} />
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AgendarCitaPublic;
