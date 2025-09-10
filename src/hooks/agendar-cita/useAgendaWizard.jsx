import { useState, useMemo } from "react";
import { formatFechaHora } from "../../utils/date";

export default function useAgendaWizard({ verificarCorreo, guardarPaciente, guardarCita }) {
  const [step, setStep] = useState(1);
  const [alerta, setAlerta] = useState({});
  const [motivoId, setMotivoId] = useState("");
  const [profesionalId, setProfesionalId] = useState("");
  const [slot, setSlot] = useState(null);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [verificado, setVerificado] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  const canNextStep1 = !!motivoId;
  const canNextStep2 = !!profesionalId && !!slot;

  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  function selectMotivo(id) {
    setMotivoId(id);
    setProfesionalId("");
    setSlot(null);
    setAlerta({});
  }
  function selectProfesional(id) {
    setProfesionalId(id);
    setSlot(null);
    setAlerta({});
  }
  function selectSlot(s) {
    setSlot(s);
    setAlerta({});
  }

  async function verificar(emailToCheck) {
    setAlerta({});
    if (!emailToCheck) {
      setAlerta({ msg:"El correo electrónico es obligatorio", error:true });
      return;
    }
    try {
      const p = await verificarCorreo(emailToCheck);
      setPaciente(p || null);
      setVerificado(true);
      if (p?.nombre) setNombre(p.nombre);
    } catch (e) {
      setPaciente(null);
      setVerificado(true);
      setAlerta({ msg: e?.message || "No encontramos un paciente con ese correo.", error:true });
    }
  }

  async function confirmar() {
    setAlerta({});
    if (!email) return setAlerta({ msg:"El correo es obligatorio para confirmar la cita", error:true });
    if (!verificado) return setAlerta({ msg:"Primero verifica tu correo.", error:true });
    if (!paciente && !nombre.trim()) return setAlerta({ msg:"Ingresa tu nombre completo.", error:true });
    if (!slot) return setAlerta({ msg:"Selecciona fecha y hora en el calendario.", error:true });

    try {
      let pacienteId = paciente?._id;
      let nombreParaMensaje = paciente?.nombre;

      if (!paciente) {
        const nuevo = await guardarPaciente({ nombre: nombre.trim(), email });
        pacienteId = nuevo._id;
        nombreParaMensaje = nuevo.nombre;
      }

      await guardarCita({
        pacienteId, title: nombreParaMensaje, start: slot.start, end: slot.end,
        motivoId, profesionalId
      });

      const { fecha, hora } = formatFechaHora(slot.start);
      setConfirmacion({ nombre: nombreParaMensaje, fecha, hora });
    } catch (e) {
      setAlerta({ msg: e?.message || "No se pudo agendar la cita. Intenta de nuevo.", error:true });
    }
  }

  const resumen = useMemo(() => {
    const fh = slot ? formatFechaHora(slot.start) : { fecha:"", hora:"" };
    return { fecha: fh.fecha, hora: fh.hora };
  }, [slot]);

  return {
    // estado
    step, alerta, motivoId, profesionalId, slot, email, nombre, paciente, verificado, confirmacion, resumen,
    // setters
    setEmail, setNombre,
    // navegación
    next, back,
    // reglas
    canNextStep1, canNextStep2,
    // acciones
    selectMotivo, selectProfesional, selectSlot, verificar, confirmar,
  };
}
