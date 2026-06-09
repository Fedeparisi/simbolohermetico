import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ChevronRight, ChevronLeft, RotateCcw, Volume2, Eye, Hand } from "lucide-react";
import { synthInstance } from "../utils/synth";

interface RitualStep {
  title: string;
  instruction: string;
  chant?: string;
  visualization?: string;
  gesture?: string;
}

interface Ritual {
  id: string;
  name: string;
  description: string;
  tradition: string;
  steps: RitualStep[];
}

const RITUALS: Ritual[] = [
  {
    id: "qabalistic_cross",
    name: "La Cruz Cabalística",
    description: "Centrado de energía básica. Trazado del pilar del medio en el cuerpo microcosmos.",
    tradition: "Hermetismo / Aurora Dorada",
    steps: [
      {
        title: "Orientación",
        instruction: "Ponte de pie mirando hacia el Este. Relaja tu cuerpo y respira profundamente.",
        visualization: "Visualiza que creces infinitamente, hasta que la Tierra es una pequeña esfera bajo tus pies.",
      },
      {
        title: "Kether",
        instruction: "Levanta tu mano derecha y con el dedo índice (o pulgar, índice y medio unidos) toca tu frente.",
        chant: "ATAH",
        visualization: "Visualiza una luz blanca brillante descender desde el cosmos infinito, formando una esfera resplandeciente justo sobre tu cabeza.",
        gesture: "Toca la frente."
      },
      {
        title: "Malkuth",
        instruction: "Baja la mano, señalando hacia abajo, y toca tu pecho o vientre.",
        chant: "MALKUTH",
        visualization: "Visualiza el rayo de luz descender por tu cuerpo y anclarse en la tierra debajo de ti, formando otra esfera de luz.",
        gesture: "Toca el pecho/vientre."
      },
      {
        title: "Geburah",
        instruction: "Lleva la mano hacia tu hombro derecho y tócalo.",
        chant: "VE-GEBURAH",
        visualization: "Visualiza el rayo de luz moviéndose desde tu centro hacia tu hombro derecho, formando una esfera de luz roja brillante.",
        gesture: "Toca el hombro derecho."
      },
      {
        title: "Chesed",
        instruction: "Cruza la mano y toca tu hombro izquierdo.",
        chant: "VE-GEDULAH",
        visualization: "El rayo cruza tu cuerpo hasta el hombro izquierdo, formando una esfera de luz azul radiante. Has formado una cruz de luz dentro de ti.",
        gesture: "Toca el hombro izquierdo."
      },
      {
        title: "El Centro",
        instruction: "Junta ambas manos entrelazadas sobre tu corazón, como en posición de rezo.",
        chant: "LE-OLAM, AMEN",
        visualization: "Visualiza una luz dorada brillante estallar en el centro de la cruz, en tu pecho, equilibrando todas las energías.",
        gesture: "Manos juntas en el pecho."
      }
    ]
  },
  {
    id: "lbrp",
    name: "Ritual Menor del Pentagrama (LBRP)",
    description: "Ritual de destierro y purificación. Limpia el aura y el espacio físico de influencias densas.",
    tradition: "Hermetismo Clásico",
    steps: [
      {
        title: "Cruz Cabalística Inicial",
        instruction: "Realiza la Cruz Cabalística para centrar tu energía.",
        visualization: "Tú eres el centro del universo, una cruz de luz brillante."
      },
      {
        title: "El Este - Aire",
        instruction: "Mira hacia el Este. Dibuja en el aire frente a ti un pentagrama de destierro (desde la cadera izquierda hacia la frente, y así).",
        chant: "YHVH (Yod-Heh-Vav-Heh)",
        visualization: "Visualiza el pentagrama llameando en fuego azul brillante. Apunta al centro e invoca el Nombre Divino vibrando.",
        gesture: "Trazar pentagrama y apuñalar el centro."
      },
      {
        title: "El Sur - Fuego",
        instruction: "Gira 90 grados a tu derecha, mirando al Sur. Mantén el brazo extendido trazando una línea desde el Este.",
        chant: "ADONAI",
        visualization: "Dibuja un nuevo pentagrama de fuego azul. Vibra el Nombre Divino imaginando que resuena hasta los confines del Sur.",
        gesture: "Trazar pentagrama y apuñalar el centro."
      },
      {
        title: "El Oeste - Agua",
        instruction: "Gira a tu derecha mirando al Oeste.",
        chant: "EHEIEH (Eh-hey-yay)",
        visualization: "Dibuja el tercer pentagrama llameante. Vibra el Nombre Divino y siéntelo resonar en las profundidades del Oeste.",
        gesture: "Trazar pentagrama y apuñalar el centro."
      },
      {
        title: "El Norte - Tierra",
        instruction: "Gira a tu derecha mirando al Norte.",
        chant: "AGLA (Ah-glah)",
        visualization: "Dibuja el cuarto pentagrama de fuego azul. Vibra el Nombre resonando en las tierras del Norte.",
        gesture: "Trazar pentagrama y apuñalar el centro."
      },
      {
        title: "Cerrar el Círculo",
        instruction: "Gira a tu derecha regresando al Este. Has completado un círculo a tu alrededor.",
        visualization: "Visualiza los cuatro pentagramas unidos por un anillo de fuego azul ardiente a tu alrededor."
      },
      {
        title: "Invocación Arcangélica",
        instruction: "Abre los brazos en forma de cruz.",
        chant: "Frente a mí Rafael, Detrás de mí Gabriel, A mi derecha Miguel, A mi izquierda Uriel.",
        visualization: "Siente la presencia protectora inmensa de las cuatro fuerzas arquetípicas cardinales a tu alrededor."
      },
      {
        title: "El Sello de la Estrella",
        instruction: "Mantén los brazos en cruz.",
        chant: "A mi alrededor llamea el Pentagrama, y en la columna brilla la Estrella de Seis Rayos.",
        visualization: "Visualiza el hexagrama dorado de Tiferet brillando en el centro de tu ser."
      },
      {
        title: "Cruz Cabalística Final",
        instruction: "Repite la Cruz Cabalística para sellar la energía del ritual.",
        visualization: "Siente el espacio completamente purificado, sellado y vibrante de luz divina."
      }
    ]
  }
];

export function RitualsView() {
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const startRitual = (ritual: Ritual) => {
    setActiveRitual(ritual);
    setCurrentStep(0);
    synthInstance.playChime(330, 1.0, "sine"); // E4 resonant
  };

  const nextStep = () => {
    if (activeRitual && currentStep < activeRitual.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Play a deeper, gong-like sound for steps with chants
      if (activeRitual.steps[currentStep + 1].chant) {
        synthInstance.playChime(220, 1.5, "triangle"); // A3 deeper
      } else {
        synthInstance.playChime(392, 0.5, "sine"); // G4 soft progression
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      synthInstance.playChime(261.63, 0.5, "sine"); // C4
    }
  };

  const cancelRitual = () => {
    setActiveRitual(null);
    setCurrentStep(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl min-h-[500px]">
        
        {!activeRitual ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif text-amber-400">Ritos Ceremoniales</h2>
                <p className="text-xs text-amber-100/60">Tecnologías de protección, destierro y centrado macrocósmico.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RITUALS.map(ritual => (
                <button
                  key={ritual.id}
                  onClick={() => startRitual(ritual)}
                  className="bg-zinc-950 border border-amber-500/10 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all p-5 rounded-xl text-left group"
                >
                  <div className="text-[10px] uppercase tracking-widest text-emerald-500/70 mb-2 font-mono">
                    {ritual.tradition}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-amber-200 group-hover:text-amber-400 transition-colors mb-2">
                    {ritual.name}
                  </h3>
                  <p className="text-xs text-amber-100/60 leading-relaxed mb-4">
                    {ritual.description}
                  </p>
                  <div className="text-xs text-amber-500 flex items-center gap-2 font-bold uppercase tracking-widest">
                    Iniciar Rito <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl mt-4">
              <p className="text-xs text-zinc-400 italic font-serif">
                "La magia ceremonial es el arte de invocar y controlar de manera consciente las fuerzas universales mediante el uso disciplinado de la voluntad y la imaginación."
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full relative">
            {/* Header Ritual */}
            <div className="flex justify-between items-center border-b border-amber-500/10 pb-4 mb-8">
              <div>
                <h2 className="text-xl font-bold font-serif text-amber-400">{activeRitual.name}</h2>
                <div className="text-[10px] uppercase tracking-widest text-amber-500/50 mt-1">
                  Paso {currentStep + 1} de {activeRitual.steps.length}
                </div>
              </div>
              <button
                onClick={cancelRitual}
                className="p-2 rounded-lg bg-zinc-900 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2 text-xs"
              >
                <RotateCcw className="w-4 h-4" /> Finalizar
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-zinc-900 rounded-full mb-8 overflow-hidden">
              <motion.div
                className="h-full bg-amber-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / activeRitual.steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Step Content */}
            <div className="flex-grow flex flex-col justify-center min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6 items-center text-center px-4"
                >
                  <h3 className="text-2xl font-serif text-amber-200 tracking-wide border-b border-amber-500/20 pb-4">
                    {activeRitual.steps[currentStep].title}
                  </h3>

                  <p className="text-sm md:text-base text-amber-100/90 leading-relaxed max-w-2xl font-sans">
                    {activeRitual.steps[currentStep].instruction}
                  </p>

                  {activeRitual.steps[currentStep].gesture && (
                    <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg border border-zinc-700 text-xs text-zinc-300">
                      <Hand className="w-4 h-4 text-zinc-500" />
                      <span>{activeRitual.steps[currentStep].gesture}</span>
                    </div>
                  )}

                  {activeRitual.steps[currentStep].chant && (
                    <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-xl flex items-center gap-3 mt-2 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                      <Volume2 className="w-5 h-5 text-amber-500 animate-pulse" />
                      <span className="text-xl md:text-2xl font-bold text-amber-500 tracking-[0.2em] uppercase font-serif">
                        {activeRitual.steps[currentStep].chant}
                      </span>
                    </div>
                  )}

                  {activeRitual.steps[currentStep].visualization && (
                    <div className="flex items-start gap-3 text-left p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl max-w-2xl mt-4">
                      <Eye className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm text-purple-200/80 italic font-serif leading-relaxed">
                        {activeRitual.steps[currentStep].visualization}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 border-t border-amber-500/10 pt-6">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-amber-200 hover:border-amber-500/30 disabled:opacity-30 disabled:hover:border-zinc-700 disabled:hover:text-zinc-400 transition-all flex items-center gap-2 text-xs uppercase font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              
              {currentStep < activeRitual.steps.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 hover:from-amber-500 hover:to-amber-400 transition-all flex items-center gap-2 text-xs uppercase font-bold shadow-lg shadow-amber-500/20"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={cancelRitual}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-zinc-950 hover:from-emerald-500 hover:to-emerald-400 transition-all flex items-center gap-2 text-xs uppercase font-bold shadow-lg shadow-emerald-500/20"
                >
                  Completar Ritual <Shield className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}
