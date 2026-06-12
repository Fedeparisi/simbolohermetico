import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, RotateCcw, Compass, ArrowRight, Eye, Shield, Brain, Activity, BookOpen, User, Lock, Sparkle } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

interface Archetype {
  id: string;
  name: string;
  tarotCard: string;
  emoji: string;
  color: string;
  description: string;
  light: string;
  shadow: string;
}

const ARCHETYPES_INFO: { [key: string]: Archetype } = {
  sabio: {
    id: "sabio",
    name: "El Sabio / El Ermitaño",
    tarotCard: "El Ermitaño (Arcano IX)",
    emoji: "🔦",
    color: "from-amber-600 to-yellow-700",
    description: "Buscas la verdad a través de la introspección, el estudio y la soledad voluntaria. Tu luz guía el camino de los neófitos.",
    light: "Sabiduría profunda, autoconocimiento, discernimiento y paciencia.",
    shadow: "Aislamiento, frialdad emocional, soberbia intelectual y rigidez."
  },
  mago: {
    id: "mago",
    name: "El Creador / El Mago",
    tarotCard: "El Mago (Arcano I)",
    emoji: "⚡",
    color: "from-purple-500 to-indigo-600",
    description: "Eres el canalizador de la voluntad divina. Utilizas las herramientas de la realidad para manifestar tu propósito.",
    light: "Poder de manifestación, ingenio, iniciativa y maestría de los elementos.",
    shadow: "Manipulación, engaño, dispersión de energía e ilusión egoica."
  },
  sombra: {
    id: "sombra",
    name: "La Sombra / El Diablo",
    tarotCard: "El Diablo (Arcano XV)",
    emoji: "🔥",
    color: "from-red-700 to-zinc-900",
    description: "Habitas en los deseos reprimidos y el poder oculto del inconsciente. Integrar tu sombra te otorga un vigor indomable.",
    light: "Fuerza vital primordial, magnetismo, pasión creativa y liberación de ataduras.",
    shadow: "Obsesión material, codependencia, manipulación y autoengaño."
  },
  heroe: {
    id: "heroe",
    name: "El Héroe / El Carro",
    tarotCard: "El Carro (Arcano VII)",
    emoji: "🛡️",
    color: "from-blue-600 to-cyan-500",
    description: "Buscas la conquista exterior mediante la disciplina, la dirección y la fuerza de voluntad orientada a metas elevadas.",
    light: "Determinación férrea, autocontrol, éxito y superación de obstáculos.",
    shadow: "Egocentrismo, impaciencia destructiva, arrogancia y desconsideración."
  },
  madre: {
    id: "madre",
    name: "La Madre / La Emperatriz",
    tarotCard: "La Emperatriz (Arcano III)",
    emoji: "🌿",
    color: "from-green-600 to-emerald-500",
    description: "Representas la abundancia, la fertilidad de la mente y la conexión con la naturaleza y las emociones nutritivas.",
    light: "Amor incondicional, creatividad ilimitada, cobijo y fertilidad.",
    shadow: "Sobreprotección asfixiante, posesividad y estancamiento emocional."
  },
  rebelde: {
    id: "rebelde",
    name: "El Rebelde / La Torre",
    tarotCard: "La Torre (Arcano XVI)",
    emoji: "💥",
    color: "from-orange-600 to-red-800",
    description: "Eres el agente de cambio y destrucción de las falsas estructuras. Derribas prisiones mentales para liberar la verdad.",
    light: "Liberación abrupta, honestidad radical, valor para romper ataduras.",
    shadow: "Ira ciega, caos destructivo innecesario y resentimiento."
  }
};

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: { [arch: string]: number };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Cuál es tu mayor temor al enfrentar una decisión de vida?",
    options: [
      { text: "Tomar una decisión sin el conocimiento suficiente y errar.", scores: { sabio: 3 } },
      { text: "Perder la capacidad de influir y moldear mi propia realidad.", scores: { mago: 3 } },
      { text: "Reprimir mi verdadera fuerza interna por complacer las normas.", scores: { sombra: 3 } },
      { text: "Fracasar públicamente y perder el control de la situación.", scores: { heroe: 3 } },
      { text: "No poder cuidar o proteger a quienes dependen de mí.", scores: { madre: 3 } },
      { text: "Seguir en una estructura cómoda pero falsa que limita mi ser.", scores: { rebelde: 3 } }
    ]
  },
  {
    id: 2,
    text: "En tu tiempo libre, te sientes más revitalizado al...",
    options: [
      { text: "Leer un libro denso o meditar en absoluto silencio.", scores: { sabio: 3 } },
      { text: "Diseñar, programar o crear algo totalmente nuevo.", scores: { mago: 3 } },
      { text: "Explorar deseos intensos, bailar o realizar actividades arriesgadas.", scores: { sombra: 3 } },
      { text: "Entrenar físicamente, competir o superar una marca personal.", scores: { heroe: 3 } },
      { text: "Cuidar plantas, cocinar para otros o conectar con la naturaleza.", scores: { madre: 3 } },
      { text: "Cuestionar el orden establecido, debatir o romper alguna rutina rígida.", scores: { rebelde: 3 } }
    ]
  },
  {
    id: 3,
    text: "¿Cómo reaccionas ante un conflicto interpersonal directo?",
    options: [
      { text: "Me retiro a analizar objetivamente las causas en soledad.", scores: { sabio: 3 } },
      { text: "Busco una solución creativa que altere la dinámica del problema.", scores: { mago: 3 } },
      { text: "Siento una ira o pasión intensa que debo controlar para no explotar.", scores: { sombra: 3 } },
      { text: "Me planto con firmeza y busco ganar el debate justificadamente.", scores: { heroe: 3 } },
      { text: "Trato de cobijar al otro y suavizar las emociones de todos.", scores: { madre: 3 } },
      { text: "Expreso la verdad de forma cruda y directa, sin importar las consecuencias.", scores: { rebelde: 3 } }
    ]
  },
  {
    id: 4,
    text: "¿Cuál de estos roles te describe mejor en un grupo de trabajo?",
    options: [
      { text: "El estratega silencioso que aporta el conocimiento clave.", scores: { sabio: 3 } },
      { text: "El innovador que propone ideas fuera de la caja.", scores: { mago: 3 } },
      { text: "El inconformista que ve los fallos ocultos del proyecto.", scores: { sombra: 3, rebelde: 1 } },
      { text: "El líder disciplinado que empuja a todos hacia la meta.", scores: { heroe: 3 } },
      { text: "El soporte empático que mantiene la cohesión emocional del equipo.", scores: { madre: 3 } },
      { text: "El catalizador que destruye metodologías obsoletas para empezar de cero.", scores: { rebelde: 3 } }
    ]
  },
  {
    id: 5,
    text: "Para ti, la espiritualidad o el desarrollo personal consiste en...",
    options: [
      { text: "La búsqueda incesante de la gnosis y la sabiduría oculta.", scores: { sabio: 3 } },
      { text: "Aprender a manifestar conscientemente la realidad astral y física.", scores: { mago: 3 } },
      { text: "Integrar mis impulsos oscuros para lograr un ser unificado.", scores: { sombra: 3 } },
      { text: "Conquistar mis debilidades a través del rigor y la autodisciplina.", scores: { heroe: 3 } },
      { text: "Nutrir y florecer mi potencial como parte de la Madre Cósmica.", scores: { madre: 3 } },
      { text: "Desmantelar las ilusiones del ego y las mentiras de la matrix terrenal.", scores: { rebelde: 3 } }
    ]
  }
];

export function ArchetypeView() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({
    sabio: 0,
    mago: 0,
    sombra: 0,
    heroe: 0,
    madre: 0,
    rebelde: 0
  });
  const [isFinished, setIsFinished] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  const handleAnswer = (optionScores: { [arch: string]: number }) => {
    synthInstance.playChime(392, 0.4, "sine");
    setScores((prev) => {
      const updated = { ...prev };
      Object.keys(optionScores).forEach((key) => {
        updated[key] = (updated[key] || 0) + optionScores[key];
      });
      return updated;
    });

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      synthInstance.playChime(523.25, 1.5, "sine");
    }
  };

  const resetTest = () => {
    setCurrentIdx(0);
    setScores({
      sabio: 0,
      mago: 0,
      sombra: 0,
      heroe: 0,
      madre: 0,
      rebelde: 0
    });
    setIsFinished(false);
    setAiResult(null);
    setErrorStr("");
    synthInstance.playChime(220, 0.8, "sine");
  };

  const getResults = () => {
    let maxScore = -1;
    let dominant = "sabio";
    const total = (Object.values(scores) as number[]).reduce((a, b) => a + b, 0) || 1;

    Object.keys(scores).forEach((key) => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        dominant = key;
      }
    });

    const percentages = Object.keys(scores).map((key) => ({
      key,
      name: ARCHETYPES_INFO[key].name,
      emoji: ARCHETYPES_INFO[key].emoji,
      color: ARCHETYPES_INFO[key].color,
      percent: Math.round((scores[key] / total) * 100)
    })).sort((a, b) => b.percent - a.percent);

    return {
      primary: ARCHETYPES_INFO[dominant],
      percentages
    };
  };

  const handleDecodeAI = async () => {
    setLoadingAI(true);
    setErrorStr("");
    setAiResult(null);
    synthInstance.playChime(440, 1.2, "sine");

    const results = getResults();
    try {
      const data = await safeFetchJSON("/api/archetype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          archetypes: results.percentages,
          answers: scores
        })
      }, "Falla en transmutación arquetípica.");
      setAiResult(data);
      synthInstance.playChime(523.25, 2.0, "sine");
    } catch (e: any) {
      setErrorStr(e.message || "Error al invocar la sabiduría del oráculo.");
    } finally {
      setLoadingAI(false);
    }
  };

  const progressPercent = (currentIdx / QUESTIONS.length) * 100;

  return (
    <div className="max-w-[calc(100%-6mm)] mx-auto flex flex-col gap-6">
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-6"
          >
            <div className="flex justify-between items-center text-xs border-b border-amber-500/10 pb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="font-bold uppercase tracking-wider text-amber-400">
                  Explorador de Arquetipos Junguianos
                </span>
              </div>
              <span className="text-zinc-500 font-mono">
                Pregunta {currentIdx + 1} de {QUESTIONS.length}
              </span>
            </div>

            <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            <h3 className="text-base md:text-lg font-bold font-serif text-amber-100 leading-snug">
              {QUESTIONS[currentIdx].text}
            </h3>

            <div className="flex flex-col gap-3">
              {QUESTIONS[currentIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.scores)}
                  className="w-full p-4 text-left rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-amber-500/35 text-xs text-amber-100/90 font-medium transition-all flex justify-between items-center group"
                >
                  <span>{opt.text}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-amber-400 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Dominante Card */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 rounded-2xl border border-amber-500/25 shadow-2xl flex flex-col gap-5 relative">
              <div className="flex flex-col items-center text-center gap-2 border-b border-amber-500/10 pb-5">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold font-serif text-amber-400 mt-2">
                  Espejo Arquetípico Revelado
                </h3>
                <p className="text-xs text-amber-100/50">
                  Tu fuerza psíquica dominante y su correspondencia del Tarot.
                </p>
              </div>

              <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row gap-5 items-start md:items-center">
                <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-5xl shrink-0">
                  {getResults().primary.emoji}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono font-bold">
                      Arquetipo Regente
                    </span>
                    <h4 className="text-lg font-bold font-serif text-amber-300">
                      {getResults().primary.name}
                    </h4>
                    <span className="text-[10px] text-amber-100/40 italic block mt-0.5">
                      {getResults().primary.tarotCard}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/80 leading-relaxed">
                    {getResults().primary.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5 pt-3 border-t border-zinc-800/80">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-emerald-400">Luz / Virtud</span>
                      <p className="text-[10px] text-amber-100/60 leading-relaxed mt-0.5">
                        {getResults().primary.light}
                      </p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-red-400 font-mono">Sombra / Desafío</span>
                      <p className="text-[10px] text-amber-100/60 leading-relaxed mt-0.5">
                        {getResults().primary.shadow}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Porcentajes */}
              <div className="flex flex-col gap-3 mt-3">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold">
                  Distribución de Fuerzas Psíquicas
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getResults().percentages.map((p) => (
                    <div
                      key={p.key}
                      className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-100/90">
                          {p.emoji} {p.name}
                        </span>
                        <span className="font-mono text-amber-400 font-bold">{p.percent}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${p.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${p.percent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                <button
                  onClick={handleDecodeAI}
                  disabled={loadingAI}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2"
                >
                  {loadingAI ? "Invocando Sabiduría..." : "Amplificación del Oráculo IA"}{" "}
                  {loadingAI ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={resetTest}
                  className="px-5 py-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 rounded-xl text-xs text-zinc-400 hover:text-amber-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Repetir
                </button>
              </div>

              {errorStr && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">
                  ❌ {errorStr}
                </div>
              )}
            </div>

            {/* AI Results */}
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/20 p-6 shadow-2xl flex flex-col gap-6 relative"
              >
                <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center">
                  <h3 className="text-sm font-bold font-serif text-amber-400 uppercase flex items-center gap-2">
                    ⚜️ Pergamino de Integración Psico-Esotérica
                  </h3>
                  <span className="text-[9px] text-amber-200/50 font-mono">Gnosis IA</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-amber-100 font-serif leading-relaxed">
                  <div className="flex flex-col gap-4">
                    {aiResult.descripcion_perfil && (
                      <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/5">
                        <h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-1.5">
                          Análisis del Perfil
                        </h4>
                        <p>{aiResult.descripcion_perfil}</p>
                      </div>
                    )}
                    {aiResult.arquetipo_dominante && (
                      <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/5">
                        <h4 className="text-[10px] font-sans font-bold uppercase text-amber-300 mb-1.5">
                          El Regente Mental
                        </h4>
                        <p>{aiResult.arquetipo_dominante}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {aiResult.integracion_sombra && (
                      <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/5">
                        <h4 className="text-[10px] font-sans font-bold uppercase text-red-400 mb-1.5">
                          Integración de la Sombra
                        </h4>
                        <p>{aiResult.integracion_sombra}</p>
                      </div>
                    )}
                    {aiResult.consejo_teurgico && (
                      <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                        <h4 className="text-[10px] font-sans font-bold uppercase text-amber-500 mb-1.5">
                          Práctica Teúrgica Equilibradora
                        </h4>
                        <p>{aiResult.consejo_teurgico}</p>
                      </div>
                    )}
                  </div>
                </div>
                {aiResult.decreto && (
                  <div className="text-center p-4 border border-zinc-800 rounded-xl bg-zinc-950/50">
                    <p className="italic text-amber-300 text-sm font-serif">"{aiResult.decreto}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
