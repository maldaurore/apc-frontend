
import usePacientes from "../hooks/usePacientes";
import useCitas from "../hooks/useCitas";
import useAgendaWizard from "../hooks/agendar-cita/useAgendaWizard";
import PasoIndicador from "../components/agendar-cita-public/PasoIndicador";
import PasoMotivo from "../components/agendar-cita-public/PasoMotivo";
import PasoProfesionalHorario from "../components/agendar-cita-public/PasoProfesionalHorario";
import PasoDatosConfirmacion from "../components/agendar-cita-public/PasoDatosConfirmacion";

const AgendarCitaPublic = () => {
  const { verificarCorreo, guardarPaciente } = usePacientes()
  const { guardarCita } = useCitas();

  const wiz = useAgendaWizard({ verificarCorreo, guardarPaciente, guardarCita });

  return (
    <div className="w-full h-full" >
      <div className="flex justify-center items-start w-full py-5" >
        <div className="w-full md:w-3/5 lg:w-1/2 bg-white shadow rounded-lg p-5" >
          <PasoIndicador />

          {wiz.step === 1 && (
            <PasoMotivo
              motivoId={wiz.motivoId}
              onChangeMotivo={wiz.selectMotivo}
              onNext={wiz.next}
              canNext={wiz.canNextStep1}
              alerta={wiz.alerta}
            />
          )}

          {wiz.step === 2 && (
            <PasoProfesionalHorario
              motivoId={wiz.motivoId}
              profesionalId={wiz.profesionalId}
              onChangeProfesional={wiz.selectProfesional}
              slot={wiz.slot}
              onSelectSlot={wiz.selectSlot}
              onBack={wiz.back}
              onNext={wiz.next}
              canNext={wiz.canNextStep2}
              alerta={wiz.alerta}
            />
          )}

          {wiz.step === 3 && (
            <PasoDatosConfirmacion
              motivoId={wiz.motivoId}
              profesionalId={wiz.profesionalId}
              resumen={wiz.resumen}
              email={wiz.setEmail ? wiz.email : ""}
              setEmail={wiz.setEmail}
              verificado={wiz.verificado}
              paciente={wiz.paciente}
              nombre={wiz.nombre}
              setNombre={wiz.setNombre}
              onVerificar={wiz.verificar}
              onBack={wiz.back}
              onConfirmar={wiz.confirmar}
              confirmacion={wiz.confirmacion}
              alerta={wiz.alerta}
            />
          )}
        </div>
      </div>
    </div>
  )
  
};

export default AgendarCitaPublic;
