import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind, Play, Square, Activity, Hand } from "lucide-react";
import { synthInstance } from "../utils/synth";

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  phases: { name: string; duration: number; action: string }[]; // duration in seconds
}

const TECHNIQUES: BreathingTechnique[] = [
  {
    id: "box",
    name: "Sama Vritti (Respiración Cuadrada)",
    description: "Equilibra el prana y calma el sistema nervioso. Ideal para la concentración profunda y la ansiedad.",
    phases: [
      { name: "Inhalar", duration: 4, action: "inhale" },
      { name: "Retener", duration: 4, action: "hold_full" },
      { name: "Exhalar", duration: 4, action: "exhale" },
      { name: "Sostener", duration: 4, action: "hold_empty" },
    ]
  },
  {
    id: "relax",
    name: "Visama Vritti (4-7-8 Relajante)",
    description: "Activa el sistema nervioso parasimpático. Excelente para inducir el sueño o la meditación profunda.",
    phases: [
      { name: "Inhalar", duration: 4, action: "inhale" },
      { name: "Retener", duration: 7, action: "hold_full" },
      { name: "Exhalar", duration: 8, action: "exhale" },
    ]
  },
  {
    id: "fire",
    name: "Kapalabhati (Respiración de Fuego)",
    description: "Ritmo vigoroso. Inhalación pasiva y exhalación activa. Limpia canales energéticos. Precaución: puede marear.",
    phases: [
      { name: "Inhalar", duration: 0.5, action: "inhale" },
      { name: "Exhalar", duration: 0.5, action: "exhale" },
    ]
  }
];

const MUDRAS = [
  { name: "Gyan Mudra", desc: "Sello del Conocimiento. Une índice y pulgar. Estimula el chakra raíz, mejora la concentración y sabiduría." },
  { name: "Prana Mudra", desc: "Sello de la Vida. Une anular, meñique y pulgar. Aumenta la vitalidad y reduce la fatiga." },
  { name: "Apana Mudra", desc: "Sello de la Digestión. Une medio, anular y pulgar. Ayuda a la purificación y desintoxicación del cuerpo." },
  { name: "Shuni Mudra", desc: "Sello de la Paciencia. Une dedo medio y pulgar. Fomenta la compasión, paciencia y entendimiento." }
];

export function KundaliniView() {
  const [activeTab, setActiveTab] = useState<"pranayama" | "mudras">("pranayama");
  const [selectedTech, setSelectedTech] = useState<BreathingTechnique>(TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsInPhase, setSecondsInPhase] = useState(0);

  // Breathing Loop Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsInPhase((prev) => {
          const phase = selectedTech.phases[currentPhaseIndex];
          if (prev + 0.1 >= phase.duration) { // using 0.1s steps for smoother visual timing if needed, but we use 1s steps here
            // Move to next phase
            const nextIndex = (currentPhaseIndex + 1) % selectedTech.phases.length;
            setCurrentPhaseIndex(nextIndex);
            
            // Play sound on phase change based on action
            const nextAction = selectedTech.phases[nextIndex].action;
            if (nextAction === "inhale") synthInstance.playChime(392, 0.5); // G4
            else if (nextAction === "exhale") synthInstance.playChime(261.63, 0.5); // C4
            else synthInstance.playChime(329.63, 0.3); // E4 for hold
            
            return 0;
          }
          return prev + 1; // 1 second increments
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, selectedTech]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setSecondsInPhase(0);
    synthInstance.playChime(392, 1.0); // Start on Inhale note
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setSecondsInPhase(0);
  };

  const currentPhase = selectedTech.phases[currentPhaseIndex];
  
  // Calculate animation target scale based on the current action
  let targetScale = 1;
  let targetOpacity = 0.5;
  if (currentPhase.action === "inhale") {
    targetScale = 1.5;
    targetOpacity = 0.9;
  } else if (currentPhase.action === "hold_full") {
    targetScale = 1.5;
    targetOpacity = 0.7;
  } else if (currentPhase.action === "exhale") {
    targetScale = 0.8;
    targetOpacity = 0.3;
  } else if (currentPhase.action === "hold_empty") {
    targetScale = 0.8;
    targetOpacity = 0.2;
  }

  // Animation duration matches the phase duration exactly
  const transitionDuration = currentPhase.action.includes("hold") ? 0.5 : currentPhase.duration;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-amber-500/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-amber-400">Kundalini & Pranayama</h2>
              <p className="text-xs text-amber-100/60">Tecnologías sagradas para el control del aliento y la energía vital.</p>
            </div>
          </div>
          
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-amber-500/10">
            <button
              onClick={() => { setActiveTab("pranayama"); handleStop(); }}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === "pranayama" ? "bg-amber-500/20 text-amber-400" : "text-zinc-500 hover:text-amber-200"}`}
            >
              Pranayama
            </button>
            <button
              onClick={() => { setActiveTab("mudras"); handleStop(); }}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === "mudras" ? "bg-amber-500/20 text-amber-400" : "text-zinc-500 hover:text-amber-200"}`}
            >
              Mudras
            </button>
          </div>
        </div>

        {activeTab === "pranayama" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[450px]">
            {/* Sidebar with techniques */}
            <div className="lg:col-span-4 flex flex-col gap-3 border-r border-amber-500/10 pr-4">
              <h3 className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold mb-2">Técnicas de Respiración</h3>
              {TECHNIQUES.map(tech => (
                <button
                  key={tech.id}
                  onClick={() => {
                    setSelectedTech(tech);
                    handleStop();
                    synthInstance.playChime(440, 0.4);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedTech.id === tech.id
                      ? "bg-amber-500/15 border-amber-500/40"
                      : "bg-zinc-950/50 border-transparent hover:border-amber-500/20 hover:bg-zinc-900"
                  }`}
                >
                  <h4 className="text-sm font-bold text-amber-200">{tech.name}</h4>
                  <p className="text-[10px] text-amber-100/50 mt-1 line-clamp-2">{tech.description}</p>
                </button>
              ))}
              
              <div className="mt-auto p-4 bg-zinc-950 border border-amber-500/10 rounded-xl">
                <h4 className="text-[10px] font-bold text-amber-400 uppercase mb-2">Ciclo Actual</h4>
                <div className="flex gap-1 text-[10px] font-mono text-zinc-400">
                  {selectedTech.phases.map((p, i) => (
                    <span key={i} className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {p.duration}s
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Breathing Interactive Area */}
            <div className="lg:col-span-8 flex flex-col items-center justify-center relative bg-zinc-950/50 rounded-2xl border border-zinc-900 overflow-hidden">
              {/* Central Breathing Circle */}
              <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[300px]">
                {!isActive ? (
                  <div className="flex flex-col items-center z-10 gap-6">
                    <Wind className="w-16 h-16 text-amber-500/20" />
                    <button
                      onClick={handleStart}
                      className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-8 py-3 rounded-full text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> Iniciar Práctica
                    </button>
                    <p className="text-xs text-amber-500/50 italic text-center max-w-xs">{selectedTech.description}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    {/* Breathing Animation */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Expanding/Contracting Circle */}
                      <motion.div
                        animate={{
                          scale: targetScale,
                          opacity: targetOpacity,
                        }}
                        transition={{
                          duration: transitionDuration,
                          ease: "linear"
                        }}
                        className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 blur-md opacity-50"
                      />
                      
                      {/* Core Circle */}
                      <motion.div
                        animate={{
                          scale: targetScale * 0.9,
                        }}
                        transition={{
                          duration: transitionDuration,
                          ease: "linear"
                        }}
                        className="absolute w-24 h-24 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                      >
                        <div className="text-amber-200 font-mono text-2xl drop-shadow-md">
                          {Math.ceil(currentPhase.duration - secondsInPhase)}
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-12 text-center flex flex-col items-center gap-4">
                      <h3 className="text-3xl font-serif text-amber-400 tracking-widest uppercase">
                        {currentPhase.name}
                      </h3>
                      
                      <button
                        onClick={handleStop}
                        className="mt-4 p-3 rounded-full bg-zinc-900 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "mudras" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
            {MUDRAS.map((mudra, idx) => (
              <div key={idx} className="bg-zinc-950 border border-amber-500/10 rounded-xl p-5 flex items-start gap-4 hover:border-amber-500/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0 shadow-lg">
                  <Hand className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-amber-400 mb-1">{mudra.name}</h3>
                  <p className="text-xs text-amber-100/70 leading-relaxed">{mudra.desc}</p>
                </div>
              </div>
            ))}
            <div className="sm:col-span-2 mt-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl text-center">
              <p className="text-xs text-amber-200 italic font-serif">"El cuerpo es el templo; las manos son las llaves que dirigen el flujo del Prana."</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
