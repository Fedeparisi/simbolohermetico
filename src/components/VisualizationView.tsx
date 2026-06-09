import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Clock, Award, Compass, Play, Pause, RotateCcw, Info, Sparkles } from "lucide-react";
import { synthInstance } from "../utils/synth";

interface Tatwa {
  id: string;
  name: string;
  element: string;
  description: string;
  meaning: string;
  color: string;
  textColor: string;
  renderSymbol: () => React.ReactNode;
}

const TATWAS: Tatwa[] = [
  {
    id: "tejas",
    name: "Tejas (Fuego)",
    element: "Fuego / Voluntad",
    description: "Un triángulo equilátero rojo vivo. Desarrolla la voluntad, el calor interno, la transmutación y la fuerza asertiva.",
    meaning: "Simboliza la llama ascendente del espíritu, el ímpetu purificador y la expansión de la conciencia solar.",
    color: "from-red-600 to-orange-500",
    textColor: "text-red-400",
    renderSymbol: () => (
      <svg className="w-40 h-40 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" viewBox="0 0 100 100">
        <polygon points="50,15 15,80 85,80" fill="#ef4444" />
      </svg>
    )
  },
  {
    id: "vayu",
    name: "Vayu (Aire)",
    element: "Aire / Intelecto",
    description: "Un círculo azul celeste o turquesa. Desarrolla la agilidad mental, la adaptabilidad y el flujo de la respiración sutil (prana).",
    meaning: "Representa el movimiento constante, la dispersión del pensamiento ilusorio y la expansión del intelecto.",
    color: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-400",
    renderSymbol: () => (
      <svg className="w-40 h-40 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="35" fill="#06b6d4" />
      </svg>
    )
  },
  {
    id: "apas",
    name: "Apas (Agua)",
    element: "Agua / Intuición",
    description: "Una media luna horizontal plateada, con los cuernos hacia arriba. Desarrolla la intuición, la absorción psíquica y el flujo emocional.",
    meaning: "Es el cáliz receptivo de la naturaleza, el subconsciente profundo y las mareas lunares de la percepción interna.",
    color: "from-blue-300 to-zinc-400",
    textColor: "text-blue-300",
    renderSymbol: () => (
      <svg className="w-40 h-40 drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]" viewBox="0 0 100 100">
        <path d="M 15,50 A 35,35 0 0,0 85,50 A 28,28 0 0,1 15,50 Z" fill="#93c5fd" />
      </svg>
    )
  },
  {
    id: "prithivi",
    name: "Prithivi (Tierra)",
    element: "Tierra / Estabilidad",
    description: "Un cuadrado amarillo brillante. Desarrolla la concentración inflexible, la solidez mental, la paciencia y el enraizamiento.",
    meaning: "Representa la condensación material de la energía divina, la estructura y el templo físico sagrado.",
    color: "from-yellow-500 to-amber-600",
    textColor: "text-amber-400",
    renderSymbol: () => (
      <svg className="w-40 h-40 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" viewBox="0 0 100 100">
        <rect x="15" y="15" width="70" height="70" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: "akasha",
    name: "Akasha (Éter)",
    element: "Éter / Conciencia Pura",
    description: "Un óvalo o huevo negro/violeta. Desarrolla la percepción del vacío primordial y la integración de todos los elementos.",
    meaning: "El espacio unificado donde la materia y la energía nacen y a donde regresan. La matriz original del cosmos.",
    color: "from-violet-600 to-fuchsia-800",
    textColor: "text-violet-400",
    renderSymbol: () => (
      <svg className="w-40 h-40 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" viewBox="0 0 100 100">
        <ellipse cx="50" cy="50" rx="25" ry="40" fill="#a855f7" />
      </svg>
    )
  }
];

interface Exercise {
  id: string;
  name: string;
  level: string;
  description: string;
  steps: string[];
}

const EXERCISES: Exercise[] = [
  {
    id: "afterimage",
    name: "1. Retención de Imagen Secundaria (Trataka Tatwa)",
    level: "Principiante",
    description: "Entrena los receptores ópticos y la concentración mental. Mirarás fijamente el símbolo durante 30-60 segundos, y al cerrar los ojos verás el color complementario exacto flotando en tu mente. Sostén esa imagen interna sin oscilar.",
    steps: [
      "Siéntate derecho y relaja los hombros.",
      "Mira fijamente el centro del Tatwa sin pestañear (o pestañeando lo mínimo posible) durante el tiempo de carga.",
      "Mantén tu respiración lenta e inhala el color del Tatwa en tu mente.",
      "Cuando suene la campana intermedia, cierra los ojos y visualiza el color complementario en el centro de tu frente (entrecejo). Sostenlo todo lo posible."
    ]
  },
  {
    id: "internalization",
    name: "2. Reconstrucción Mental Activa",
    level: "Intermedio",
    description: "Entrena el verdadero Ojo de la Mente (visualización sin estímulo físico externo). Miras el símbolo por unos segundos, cierras los ojos y recreas activamente su forma, sus bordes y su brillo con el poder de tu imaginación.",
    steps: [
      "Observa el Tatwa detalladamente: sus líneas perfectas, su geometría y su brillo.",
      "Cierra los ojos voluntariamente.",
      "En la oscuridad de tus párpados, dibuja mentalmente el símbolo línea por línea.",
      "Si la imagen se desvanece, abre los ojos 3 segundos para recargar la memoria visual y vuelve a cerrar para seguir visualizando."
    ]
  },
  {
    id: "3d_rotation",
    name: "3. Rotación Tridimensional del Sólido Astral",
    level: "Avanzado",
    description: "Desarrolla la proyección geométrica en el espacio astral. Visualizas el Tatwa plano transformándose en un sólido tridimensional (Tetraedro, Esfera, Cáliz, Cubo u Ovoide) y hazlo girar lentamente en el aire de tu mente.",
    steps: [
      "Inicia con los ojos cerrados o mirando al vacío.",
      "Proyecta el Tatwa plano a 50cm frente a tus ojos mentales.",
      "Dale volumen en tres dimensiones: el triángulo se vuelve una pirámide de fuego, el círculo una esfera azul, etc.",
      "Haz que gire lentamente 360 grados sobre su eje vertical. Observa el volumen, el brillo y la sombra de tu proyección."
    ]
  }
];

export function VisualizationView() {
  const [activeTatwa, setActiveTatwa] = useState<Tatwa>(TATWAS[0]);
  const [activeExercise, setActiveExercise] = useState<Exercise>(EXERCISES[0]);
  const [duration, setDuration] = useState(60); // seconds
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"observe" | "internalize" | "finished">("observe");
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, activeTatwa, activeExercise]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Halfway through "afterimage" exercise, trigger the switch to internalization
          if (activeExercise.id === "afterimage" && prev === Math.floor(duration / 2) && phase === "observe") {
            setPhase("internalize");
            synthInstance.playChime(660, 1.5, "triangle");
          }
          if (prev <= 1) {
            setIsActive(false);
            setPhase("finished");
            synthInstance.playChime(440, 2.5, "sine");
            // Play a triple chime at completion
            setTimeout(() => synthInstance.playChime(554.37, 1.5, "sine"), 300);
            setTimeout(() => synthInstance.playChime(659.25, 2.0, "sine"), 600);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, duration, activeExercise]);

  const handleStart = () => {
    if (phase === "finished") {
      setPhase("observe");
      setTimeLeft(duration);
    }
    setIsActive(true);
    synthInstance.playChime(440, 1.2, "sine");
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("observe");
    setTimeLeft(duration);
    synthInstance.playChime(220, 0.8, "sine");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentPercent = (timeLeft / duration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto"
    >
      {/* Columna Izquierda: Configuración del ejercicio */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Selector de Tatwas (Símbolos) */}
        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-amber-500/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              1. Selecciona el Tatwa (Símbolo de Enfoque)
            </h3>
          </div>
          <p className="text-[11px] text-amber-200/50 leading-relaxed">
            Los Tatwas son las corrientes de energía sutil en el hermetismo y el yoga. Su contemplación fija
            purifica los canales de percepción del ojo mental.
          </p>
          <div className="grid grid-cols-5 gap-2">
            {TATWAS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTatwa(t);
                  handleReset();
                  synthInstance.playChime(330, 0.4, "sine");
                }}
                className={`py-3 flex flex-col items-center gap-1.5 rounded-lg border transition-all ${
                  activeTatwa.id === t.id
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5"
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
                title={t.name}
              >
                <div className="scale-75 shrink-0 select-none">{t.renderSymbol()}</div>
                <span className="text-[9px] font-bold uppercase tracking-wider truncate w-full text-center px-1">
                  {t.id}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-zinc-950/70 border border-zinc-800 rounded-xl">
            <span className={`text-[10px] font-bold uppercase ${activeTatwa.textColor}`}>
              {activeTatwa.name} — Regente de {activeTatwa.element}
            </span>
            <p className="text-xs text-amber-100/70 mt-1 font-serif leading-relaxed">
              {activeTatwa.description}
            </p>
            <p className="text-[10px] text-amber-500/40 italic mt-1.5 border-t border-zinc-800/50 pt-1">
              {activeTatwa.meaning}
            </p>
          </div>
        </div>

        {/* Selección de Ejercicio */}
        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-amber-500/10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              2. Método de Visualización
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            {EXERCISES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  setActiveExercise(ex);
                  handleReset();
                  synthInstance.playChime(392, 0.4, "sine");
                }}
                className={`p-3 text-left rounded-xl border transition-all flex flex-col gap-1 ${
                  activeExercise.id === ex.id
                    ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                    : "bg-zinc-950/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/30"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-xs font-bold font-serif">{ex.name}</span>
                  <span
                    className={`text-[8px] px-1.5 py-0.5 rounded-full border ${
                      ex.level === "Principiante"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : ex.level === "Intermedio"
                        ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        : "border-purple-500/20 bg-purple-500/10 text-purple-400"
                    }`}
                  >
                    {ex.level}
                  </span>
                </div>
                <p className="text-[10px] opacity-75 leading-relaxed font-sans">{ex.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Ajuste de tiempo */}
        <div className="bg-zinc-900/50 p-5 rounded-2xl border border-amber-500/10 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                3. Duración de la Sesión
              </span>
            </div>
            <span className="text-xs font-bold text-amber-300 font-mono">{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={30}
            max={300}
            step={30}
            value={duration}
            onChange={(e) => {
              setDuration(Number(e.target.value));
              handleReset();
            }}
            disabled={isActive}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
            <span>30 Segundos</span>
            <span>2 Minutos</span>
            <span>5 Minutos</span>
          </div>
        </div>
      </div>

      {/* Columna Derecha: El Visualizador */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col items-center gap-6 relative overflow-hidden min-h-[500px] justify-center">
          {/* Fondo difuso dinámico basado en el tatwa */}
          <div
            className={`absolute w-72 h-72 rounded-full filter blur-[80px] pointer-events-none opacity-10 bg-gradient-to-tr ${activeTatwa.color}`}
          />

          <AnimatePresence mode="wait">
            {phase === "observe" && (
              <motion.div
                key="observe"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-6 w-full text-center"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500/70 font-mono border border-amber-500/10 px-3 py-1 rounded-full bg-amber-500/5">
                  Fase de Fijación Visual
                </span>
                <div className="relative p-8 rounded-full border border-amber-500/5 bg-zinc-900/10 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-pulse" />
                  {activeTatwa.renderSymbol()}
                </div>
                <p className="text-xs text-amber-100/60 max-w-sm font-serif italic">
                  "Mira fijamente la figura central, absorbiendo su forma y color en tu conciencia."
                </p>
              </motion.div>
            )}

            {phase === "internalize" && (
              <motion.div
                key="internalize"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-8 w-full text-center"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 font-mono border border-purple-500/10 px-3 py-1 rounded-full bg-purple-500/5">
                  Fase de Visualización Interna
                </span>
                <div className="w-40 h-40 rounded-full border border-dashed border-purple-500/30 flex items-center justify-center bg-zinc-950/80 shadow-inner relative">
                  <Eye className="w-10 h-10 text-purple-400/20 absolute animate-pulse" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute inset-2 border-t border-purple-500/10 rounded-full"
                  />
                </div>
                <div className="max-w-sm flex flex-col gap-2">
                  <span className="text-xs font-bold text-purple-300 font-serif">¡CIERRA LOS OJOS AHORA!</span>
                  <p className="text-xs text-amber-100/60 font-serif leading-relaxed">
                    Visualiza la imagen residual (tatwa complementario) flotando frente a tu frente.
                    Sostén la imagen geométrica firme y nítida.
                  </p>
                </div>
              </motion.div>
            )}

            {phase === "finished" && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-4 w-full text-center"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
                  <Award className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-emerald-400 font-serif">Visualización Completada</h4>
                <p className="text-xs text-amber-100/70 max-w-sm leading-relaxed">
                  Has completado la fijación mental. Con la práctica regular de tatwas, tu capacidad de
                  proyectar y sostener imágenes en el ojo de tu mente se fortalecerá exponencialmente.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-4 py-2 border border-zinc-800 hover:border-amber-500/30 text-xs text-amber-200/80 bg-zinc-950 rounded-lg transition-all"
                >
                  Volver a Empezar
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Temporizador e Controles */}
          {phase !== "finished" && (
            <div className="w-full max-w-xs flex flex-col items-center gap-4 mt-6">
              {/* Progreso Visual */}
              <div className="w-full bg-zinc-900 border border-zinc-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${
                    phase === "observe" ? activeTatwa.color : "from-purple-500 to-indigo-600"
                  }`}
                  animate={{ width: `${currentPercent}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] text-zinc-500 uppercase font-mono">Tiempo Restante</span>
                <span className="text-xl font-bold font-mono text-amber-300">{formatTime(timeLeft)}</span>
              </div>

              <div className="flex gap-2 w-full">
                {isActive ? (
                  <button
                    onClick={handlePause}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-200 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pausar
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 border border-amber-400 text-zinc-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
                  >
                    <Play className="w-3.5 h-3.5" /> {phase === "finished" ? "Reiniciar" : "Comenzar"}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/20 rounded-xl flex items-center justify-center transition-all"
                  title="Reiniciar ejercicio"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones detalladas de la práctica */}
        <div className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900 flex flex-col gap-3">
          <button
            onClick={() => {
              setShowInfo(!showInfo);
              synthInstance.playChime(400, 0.3, "sine");
            }}
            className="flex items-center gap-2 text-xs font-bold text-amber-400/80 hover:text-amber-400 transition-all text-left"
          >
            <Info className="w-4 h-4 shrink-0" />
            <span>¿Cómo practicar este ejercicio correctamente?</span>
          </button>
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col gap-2.5 text-xs text-amber-100/60 leading-relaxed font-sans mt-1 border-t border-zinc-900 pt-3"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>El Ojo Astral:</strong> La capacidad de visualización no es un "don", es un músculo
                    psíquico. Practicar 5 minutos diarios con Tatwas mejora drásticamente las lecturas del tarot,
                    viaje astral (pathworking) e invocación ceremonial.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-5 list-decimal">
                  {activeExercise.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="font-bold text-amber-500/70">{idx + 1}.</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
