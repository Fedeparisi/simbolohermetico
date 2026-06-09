import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Square, Volume2, Wind } from "lucide-react";
import { synthInstance } from "../utils/synth";

interface Meditation {
  id: string;
  title: string;
  description: string;
  durationOptions: number[]; // in minutes
  frequency: number; // binaural or carrier frequency in Hz
  prompts: string[];
}

const MEDITATIONS: Meditation[] = [
  {
    id: "void",
    title: "Meditación del Vacío",
    description: "Centrado absoluto. Silencia la mente para acceder al punto cero de manifestación.",
    durationOptions: [5, 10, 20],
    frequency: 432, // Hz
    prompts: [
      "Encuentra una postura cómoda y cierra los ojos...",
      "Inhala profundamente... exhala toda tensión.",
      "Lleva tu atención al espacio entre tus pensamientos.",
      "No juzgues lo que surge. Solo obsérvalo y déjalo pasar.",
      "Concéntrate en la oscuridad detrás de tus párpados.",
      "Eres el observador silencioso.",
      "Descansa en este vacío fértil.",
      "El silencio es la fuente de todo sonido."
    ]
  },
  {
    id: "auric",
    title: "Resonancia Áurica",
    description: "Limpieza y expansión del campo áurico mediante la visualización de luz.",
    durationOptions: [5, 10],
    frequency: 528, // Hz (Solfeggio)
    prompts: [
      "Respira lentamente, sintiendo el peso de tu cuerpo.",
      "Imagina una pequeña esfera de luz dorada en tu pecho.",
      "Con cada inhalación, la luz se hace más brillante.",
      "Con cada exhalación, la luz se expande por tu cuerpo.",
      "La luz llena ahora toda la habitación.",
      "Siente cómo esta luz disuelve cualquier energía densa.",
      "Tu aura es un escudo brillante e impenetrable.",
      "Descansa en la calidez de tu propia luz."
    ]
  },
  {
    id: "tree",
    title: "Pilar del Medio",
    description: "Alineación energética basada en el Árbol de la Vida Cabalístico.",
    durationOptions: [10, 20],
    frequency: 396, // Hz
    prompts: [
      "Visualiza una luz blanca brillante por encima de tu cabeza (Kether).",
      "La luz desciende hacia tu garganta, irradiando un tono índigo (Daath).",
      "Siente la luz bajar hasta tu corazón, un sol amarillo radiante (Tiferet).",
      "La luz continúa hacia tu zona pélvica, de color violeta profundo (Yesod).",
      "Finalmente, la luz llega a tus pies, anclándose en la tierra (Malkuth).",
      "Siente la corriente de energía fluir desde el cielo hasta la tierra.",
      "Eres un pilar de luz entre ambos mundos.",
      "Mantén esta conexión. Respira."
    ]
  }
];

export function MeditationView() {
  const [selectedMeditation, setSelectedMeditation] = useState<Meditation | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(5);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  
  // Audio references
  const audioContextRef = useRef<AudioContext | null>(null);
  const droneOscillatorRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      handleStop();
      // Play final chime
      synthInstance.playChime(440, 2.0);
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  // Prompt cycling based on progress
  useEffect(() => {
    if (!isActive || !selectedMeditation) return;
    
    const totalSeconds = selectedDuration * 60;
    const elapsed = totalSeconds - timeRemaining;
    const promptCount = selectedMeditation.prompts.length;
    const timePerPrompt = totalSeconds / promptCount;
    
    const newIndex = Math.floor(elapsed / timePerPrompt);
    if (newIndex !== currentPromptIndex && newIndex < promptCount) {
      setCurrentPromptIndex(newIndex);
      // Play a soft bowl sound when prompt changes
      synthInstance.playChime(330, 0.5);
    }
  }, [timeRemaining, isActive, selectedMeditation, selectedDuration, currentPromptIndex]);

  const startDrone = (frequency: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Soft LFO for volume pulsing
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // very slow pulse
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.2, ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    // Initial fade in
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    droneOscillatorRef.current = osc;
    droneGainRef.current = gain;
  };

  const stopDrone = () => {
    if (droneGainRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      const gain = droneGainRef.current;
      
      // Fade out
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      
      setTimeout(() => {
        droneOscillatorRef.current?.stop();
        droneOscillatorRef.current?.disconnect();
        droneGainRef.current?.disconnect();
        droneOscillatorRef.current = null;
        droneGainRef.current = null;
      }, 2000);
    }
  };

  const handleStart = () => {
    if (!selectedMeditation) return;
    setIsActive(true);
    setTimeRemaining(selectedDuration * 60);
    setCurrentPromptIndex(0);
    synthInstance.playChime(220, 1.0);
    startDrone(selectedMeditation.frequency);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeRemaining(0);
    stopDrone();
  };

  const handlePause = () => {
    setIsActive(false);
    stopDrone(); // Pause stops the drone, we would need to restart it
  };

  const handleResume = () => {
    setIsActive(true);
    if (selectedMeditation) {
      startDrone(selectedMeditation.frequency);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Meditaciones Guiadas</h2>
            <p className="text-xs text-amber-100/60">Sintoniza tu frecuencia a través de la quietud y el sonido.</p>
          </div>
        </div>

        {!isActive && timeRemaining === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">1. Elige tu Práctica</h3>
              <div className="flex flex-col gap-3">
                {MEDITATIONS.map(med => (
                  <button
                    key={med.id}
                    onClick={() => { setSelectedMeditation(med); setSelectedDuration(med.durationOptions[0]); synthInstance.playChime(330, 0.4); }}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      selectedMeditation?.id === med.id
                        ? "bg-amber-500/15 border-amber-500/40 shadow-lg shadow-amber-500/10"
                        : "bg-zinc-950 border-amber-500/10 hover:border-amber-500/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-serif font-bold ${selectedMeditation?.id === med.id ? "text-amber-400" : "text-amber-100"}`}>{med.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-mono">{med.frequency}Hz</span>
                    </div>
                    <p className="text-xs text-amber-100/60 leading-relaxed">{med.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">2. Configura el Tiempo</h3>
              {selectedMeditation ? (
                <div className="bg-zinc-950 rounded-xl p-5 border border-amber-500/10 flex flex-col gap-6">
                  <div className="flex flex-wrap gap-3">
                    {selectedMeditation.durationOptions.map(dur => (
                      <button
                        key={dur}
                        onClick={() => setSelectedDuration(dur)}
                        className={`flex-1 py-3 rounded-lg border text-sm font-bold transition-all ${
                          selectedDuration === dur
                            ? "bg-amber-500/20 border-amber-500 text-amber-300"
                            : "bg-zinc-900 border-amber-500/20 text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        {dur} min
                      </button>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-amber-500/10 flex items-start gap-3">
                    <Volume2 className="w-4 h-4 text-amber-500/70 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-100/70 leading-relaxed">
                      Esta meditación utiliza una frecuencia base de <strong>{selectedMeditation.frequency}Hz</strong>. 
                      Se recomienda usar auriculares para experimentar los tonos isocrónicos y una inmersión completa.
                    </p>
                  </div>

                  <button
                    onClick={handleStart}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" /> Comenzar Práctica
                  </button>
                </div>
              ) : (
                <div className="h-full bg-zinc-950/50 rounded-xl border border-dashed border-amber-500/20 flex items-center justify-center p-6 text-center">
                  <p className="text-xs text-zinc-500">Selecciona una práctica a la izquierda para continuar.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 px-4 min-h-[400px] justify-center relative">
            {/* Visualizer Background */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <motion.div
                animate={{ 
                  scale: isActive ? [1, 1.2, 1] : 1,
                  opacity: isActive ? [0.1, 0.3, 0.1] : 0.1
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="w-96 h-96 rounded-full bg-amber-500/20 filter blur-[80px]"
              />
            </div>

            <div className="z-10 flex flex-col items-center w-full max-w-lg">
              <div className="text-amber-500 font-mono text-5xl mb-8 tracking-widest drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
                {formatTime(timeRemaining)}
              </div>

              <div className="h-32 flex items-center justify-center mb-12 text-center w-full">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPromptIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 1.5 }}
                    className="text-lg md:text-xl font-serif text-amber-100/90 leading-relaxed"
                  >
                    {selectedMeditation?.prompts[currentPromptIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-6">
                {isActive ? (
                  <button
                    onClick={handlePause}
                    className="w-14 h-14 rounded-full bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-zinc-800 transition-all hover:scale-105"
                  >
                    <Pause className="w-5 h-5 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="w-14 h-14 rounded-full bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-zinc-800 transition-all hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-current ml-1" />
                  </button>
                )}
                
                <button
                  onClick={handleStop}
                  className="w-12 h-12 rounded-full bg-zinc-900 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-zinc-800 transition-all hover:scale-105"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
