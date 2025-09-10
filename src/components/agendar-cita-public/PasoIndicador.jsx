export default function PasoIndicador({ step }) {
  const steps = [
    { 
      id: 1, 
      label: "Motivo" 
    }, 
    { 
      id: 2, 
      label: "Profesional y horario" 
    },
    { 
      id: 3, 
      label: "Datos y confirmación" 
    }, 
  ];

  return ( 
    <div className="flex items-center justify-center gap-3 mb-6"> 
      {steps.map((s) => ( 
        <div key={s.id} className="flex items-center gap-2"> 
          <div 
            className={[ "w-8 h-8 rounded-full flex items-center justify-center font-bold", 
              step === s.id ? "bg-indigo-600 text-white" : step > s.id ? "bg-green-500 text-white" : 
              "bg-gray-200 text-gray-700", ].join(" ")} 
            title={s.label} > 
              {s.id} 
            </div> 
            <span className="hidden sm:inline text-sm font-semibold text-gray-700">
              {s.label}
            </span>
          </div>
        ))} 
      </div> 
    );
}