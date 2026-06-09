import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Award, RotateCcw, Compass, ArrowRight, BookOpen, Shield, Flame, Activity } from "lucide-react";
import { synthInstance } from "../utils/synth";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: { [path: string]: number };
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "¿Qué buscas principalmente al adentrarte en el ocultismo?",
    options: [
      { text: "Comprender las leyes del cosmos y la sabiduría universal.", scores: { cabala: 3, alquimia: 1 } },
      { text: "La transmutación interior de mis debilidades en virtudes.", scores: { alquimia: 3, oriental: 1 } },
      { text: "Pragmatismo absoluto: hackear la realidad y obtener resultados concretos.", scores: { caos: 3 } },
      { text: "La comunión directa con inteligencias divinas y angélicas mediante alta teúrgia.", scores: { teurgia: 3 } },
      { text: "Conectar profundamente con la Madre Naturaleza, las fases lunares y las plantas.", scores: { brujeria: 3 } },
      { text: "La trascendencia espiritual, el vacío y el despertar de la conciencia pura.", scores: { oriental: 3, cabala: 1 } }
    ]
  },
  {
    id: 2,
    text: "Si pudieras heredar un objeto de poder, ¿cuál elegirías?",
    options: [
      { text: "Un grimorio cifrado con el Árbol de la Vida y nombres divinos.", scores: { cabala: 3 } },
      { text: "Un vial sellado con el elixir del León Verde y polvo de oro puro.", scores: { alquimia: 3 } },
      { text: "Un bloc de dibujo y pinturas para crear sigilos y tulpas abstractas.", scores: { caos: 3 } },
      { text: "Una espada ceremonial consagrada y un pentáculo de cera pura.", scores: { teurgia: 3 } },
      { text: "Un caldero de bronce antiguo y un mortero de piedra volcánica.", scores: { brujeria: 3 } },
      { text: "Un vajra tibetano y un cuenco que emite frecuencias cósmicas.", scores: { oriental: 3 } }
    ]
  },
  {
    id: 3,
    text: "¿Cómo consideras la existencia de los Dioses o entidades del bajo astral?",
    options: [
      { text: "Emanaciones y filtros del Uno Supremo (Ein Sof).", scores: { cabala: 3, teurgia: 1 } },
      { text: "Proyecciones psíquicas del inconsciente y metales de la mente.", scores: { alquimia: 3, oriental: 1 } },
      { text: "Egregores o herramientas mentales intercambiables: 'La creencia es mi herramienta'.", scores: { caos: 3 } },
      { text: "Seres suprasensibles reales en planos invisibles que requieren invocación exacta.", scores: { teurgia: 3 } },
      { text: "Espíritus de la tierra, guardianes de la naturaleza y ancestros.", scores: { brujeria: 3 } },
      { text: "Manifestaciones de la mente samsárica, ilusiones que hay que liberar.", scores: { oriental: 3 } }
    ]
  },
  {
    id: 4,
    text: "¿Cuál es tu espacio ideal para realizar un trabajo espiritual?",
    options: [
      { text: "Un estudio rodeado de libros arcanos, diagramas de letras y símbolos numéricos.", scores: { cabala: 3 } },
      { text: "Un laboratorio lleno de frascos, retortas, destiladores y esencias herbales.", scores: { alquimia: 3 } },
      { text: "Cualquier rincón urbano, una habitación caótica o la vía pública: no dependo de templos.", scores: { caos: 3 } },
      { text: "Un templo consagrado con cortinajes purpúreos, un altar central y velas de cera.", scores: { teurgia: 3 } },
      { text: "Un claro en el bosque bajo la luna llena, con piedras en círculo.", scores: { brujeria: 3 } },
      { text: "Una sala vacía, un cojín de meditación y olor a sándalo puro.", scores: { oriental: 3 } }
    ]
  },
  {
    id: 5,
    text: "Al enfrentarte a una crisis existencial, tu primera reacción es...",
    options: [
      { text: "Buscar respuestas en diagramas cabalísticos y correspondencias celestes.", scores: { cabala: 3 } },
      { text: "Iniciar un proceso interno de disolución y destilación de mis emociones (Nigredo).", scores: { alquimia: 3 } },
      { text: "Desestructurar mis creencias y cambiar mi paradigma para superar el bache.", scores: { caos: 3 } },
      { text: "Realizar un ritual menor del pentagrama para limpiar mi aura y consagrar mi mente.", scores: { teurgia: 3 } },
      { text: "Conectar con la tierra descalzo, recolectar hierbas y preparar una infusión mágica.", scores: { brujeria: 3 } },
      { text: "Sentarme en loto a contemplar el vacío y el desapego del sufrimiento.", scores: { oriental: 3 } }
    ]
  },
  {
    id: 6,
    text: "¿Cuál de estos principios resuena más fuertemente en tu alma?",
    options: [
      { text: "'Como es arriba, es abajo; como es adentro, es afuera'.", scores: { cabala: 3, alquimia: 2 } },
      { text: "'Visita el interior de la tierra; rectificando encontrarás la piedra oculta'.", scores: { alquimia: 3 } },
      { text: "'Nada es verdad, todo está permitido'.", scores: { caos: 3 } },
      { text: "'Por la teúrgia, el alma se une al principio divino y se purifica'.", scores: { teurgia: 3 } },
      { text: "'Haz tu voluntad, mas no dañes a nadie'.", scores: { brujeria: 3 } },
      { text: "'El vacío es forma y la forma es vacío'.", scores: { oriental: 3 } }
    ]
  },
  {
    id: 7,
    text: "Si tuvieras que realizar un ritual de prosperidad, ¿qué método preferirías?",
    options: [
      { text: "Cálculos gemátricos de nombres divinos y trazar sellos celestiales.", scores: { cabala: 3 } },
      { text: "Crear una tintura espagírica consagrada con oro coloidal y sol.", scores: { alquimia: 3 } },
      { text: "Dibujar un sigilo con letras distorsionadas, cargarlo con risa o éxtasis y quemarlo.", scores: { caos: 3 } },
      { text: "Hacer una invocación formal al arcángel de la esfera de Júpiter con incienso de mirra.", scores: { teurgia: 3 } },
      { text: "Ofrendar miel, monedas y canela a los espíritus del hogar bajo luna creciente.", scores: { brujeria: 3 } },
      { text: "Entonar mantras divinos y visualizar la deidad Dzambala de la riqueza.", scores: { oriental: 3 } }
    ]
  },
  {
    id: 8,
    text: "¿Cuál es tu postura ante el dogma y la tradición escrita?",
    options: [
      { text: "Estudio riguroso de las escrituras arcanas en busca de claves decodificadoras.", scores: { cabala: 3 } },
      { text: "Respeto a las fórmulas maestras, pero con constante verificación en el laboratorio interior.", scores: { alquimia: 3 } },
      { text: "Rechazo absoluto: el dogma es una prisión; el eclecticismo y el caos son la libertad.", scores: { caos: 3 } },
      { text: "Firme seguimiento de las fórmulas tradicionales y protecciones ceremoniales antiguas.", scores: { teurgia: 3 } },
      { text: "Tradición oral basada en ciclos naturales; el verdadero templo no se escribe.", scores: { brujeria: 3 } },
      { text: "Guía de maestros (gurús), pero la realización final depende de tu propia experiencia de silencio.", scores: { oriental: 3 } }
    ]
  }
];

interface PathResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  recommendations: string[];
}

const PATHS_INFO: { [key: string]: PathResult } = {
  cabala: {
    id: "cabala",
    name: "Hermetismo & Cábala (Sendero del Rayo)",
    emoji: "🌳",
    color: "from-amber-500 to-amber-600",
    description: "Eres un buscador de la arquitectura cósmica. Te fascinan las correspondencias exactas, las matemáticas sagradas (gematría), el Árbol de la Vida y descifrar las leyes ocultas detrás de la creación. Tu mente florece en el estudio y la decodificación del intelecto universal.",
    recommendations: [
      "Profundiza en la Cábala teórica (*Zohar*, *Séfer Yetzirá*).",
      "Utiliza nuestro módulo de **Gematría** para decodificar términos y sellos divinos.",
      "Práctica el ejercicio del Pilar Medio para equilibrar los pilares de tu templo interior."
    ]
  },
  alquimia: {
    id: "alquimia",
    name: "Alquimia & Espagiria (La Gran Obra)",
    emoji: "🧪",
    color: "from-emerald-500 to-teal-600",
    description: "Tu sendero es el de la transmutación. Entiendes que el espíritu y la materia están entrelazados, y buscas purificar tus aspectos bajos (plomo) para revelar tu conciencia superior (oro). Valoras los procesos reflexivos (Nigredo, Albedo, Rubedo) y la medicina sagrada.",
    recommendations: [
      "Estudia espagiria y herbolaria alquímica elemental.",
      "Utiliza nuestro módulo de **Visualización de Tatwas** para entrenar la fijeza en el laboratorio de tu mente.",
      "Realiza meditaciones de transmutación y purificación de los chakras."
    ]
  },
  caos: {
    id: "caos",
    name: "Magia del Caos (El Hacker Astral)",
    emoji: "🌀",
    color: "from-purple-500 to-indigo-600",
    description: "Eres libre, ecléctico e iconoclasta. Para ti, la creencia no es un dogma, sino una herramienta temporal que puedes usar y descartar. Valoras los resultados prácticos, los estados de gnosis inducidos y crear tus propios sigilos libres de dogmas antiguos.",
    recommendations: [
      "Práctica el diseño y activación de sigilos en nuestro módulo de **Sigilos**.",
      "Desarrolla servidores y formas de pensamiento autónomas para tus fines prácticos.",
      "Lee a Austin Osman Spare y Peter Carroll (*Liber Null*)."
    ]
  },
  teurgia: {
    id: "teurgia",
    name: "Teúrgia & Alta Magia Ceremonial",
    emoji: "🛡️",
    color: "from-red-600 to-amber-700",
    description: "Tu sendero es el del teúrgo: invocar fuerzas divinas superiores para consagrar el plano terrenal. Valoras los rituales solemnes, las herramientas sagradas consagradas (cáliz, espada, vara), las horas astrológicas y la protección absoluta del círculo.",
    recommendations: [
      "Ejecuta con regularidad el **Ritual Menor del Pentagrama (LBRP)** en nuestro módulo de **Rituales**.",
      "Estudia la correspondencia de las horas planetarias y fases lunares antes de cualquier operación.",
      "Estudia el sistema Enociano y la Clavícula de Salomón."
    ]
  },
  brujeria: {
    id: "brujeria",
    name: "Brujería Tradicional & Wicca (Sendero Verde)",
    emoji: "🌙",
    color: "from-green-600 to-emerald-800",
    description: "Estás profundamente conectado con los ritmos de la Tierra. El susurro del viento, las fases de la luna y las propiedades ocultas de las plantas son tus mayores maestros. Sientes afinidad por los aquelarres, los elementales del bosque y la magia popular integradora.",
    recommendations: [
      "Sigue nuestro **Calendario Lunar** para sincronizar tus baños de purificación y siembras.",
      "Crea tu propio herbario mágico con correspondencias de planetas.",
      "Estudia el animismo y realiza ofrendas de gratitud a los espíritus locales (Genius Loci)."
    ]
  },
  oriental: {
    id: "oriental",
    name: "Misticismo Oriental & Vajrayana",
    emoji: "🧘",
    color: "from-cyan-500 to-blue-600",
    description: "Tu búsqueda apunta al silencio primordial y la disolución del ego ilusorio. Te atrae el yoga de la energía, la meditación de atención plena, el budismo tántrico y el despertar de los canales energéticos del cuerpo sutil.",
    recommendations: [
      "Práctica pranayama avanzado en nuestro módulo de **Kundalini**.",
      "Estudia las visualizaciones de deidades tántricas como mapas de la psique pura.",
      "Realiza meditaciones silenciosas prolongadas fijando tu atención en frecuencias binaurales de 432Hz."
    ]
  }
};

export function MagicPathTest() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<{ [path: string]: number }>({
    cabala: 0,
    alquimia: 0,
    caos: 0,
    teurgia: 0,
    brujeria: 0,
    oriental: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (optionScores: { [path: string]: number }) => {
    // Sound effect
    synthInstance.playChime(370, 0.4, "sine");

    // Add scores
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
      setTimeout(() => synthInstance.playChime(659.25, 1.8, "sine"), 250);
    }
  };

  const resetTest = () => {
    setCurrentIdx(0);
    setScores({
      cabala: 0,
      alquimia: 0,
      caos: 0,
      teurgia: 0,
      brujeria: 0,
      oriental: 0
    });
    setIsFinished(false);
    synthInstance.playChime(220, 0.8, "sine");
  };

  // Find dominant path
  const getResults = () => {
    let maxScore = -1;
    let primaryPath = "cabala";
    const total = (Object.values(scores) as number[]).reduce((acc, curr) => acc + curr, 0) || 1;

    Object.keys(scores).forEach((key) => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        primaryPath = key;
      }
    });

    // Calculate percentages
    const percentages = Object.keys(scores).map((key) => ({
      key,
      name: PATHS_INFO[key].name,
      emoji: PATHS_INFO[key].emoji,
      color: PATHS_INFO[key].color,
      percent: Math.round((scores[key] / total) * 100)
    })).sort((a, b) => b.percent - a.percent);

    return {
      primary: PATHS_INFO[primaryPath],
      percentages
    };
  };

  const progressPercent = ((currentIdx) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="question-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-6 relative"
          >
            {/* Header / Progreso */}
            <div className="flex justify-between items-center text-xs border-b border-amber-500/10 pb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="font-bold uppercase tracking-wider text-amber-400">
                  Test del Sendero Mágico
                </span>
              </div>
              <span className="text-zinc-500 font-mono">
                Pregunta {currentIdx + 1} de {QUESTIONS.length}
              </span>
            </div>

            {/* Barra de progreso */}
            <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-500"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>

            {/* Texto de Pregunta */}
            <h3 className="text-base md:text-lg font-bold font-serif text-amber-100 leading-snug">
              {QUESTIONS[currentIdx].text}
            </h3>

            {/* Opciones */}
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
            key="results-card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 md:p-8 rounded-2xl border border-amber-500/25 shadow-2xl flex flex-col gap-6 relative"
          >
            {/* Cabecera del Resultado */}
            <div className="flex flex-col items-center text-center gap-2 border-b border-amber-500/10 pb-5">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-serif text-amber-400 mt-2">
                Afinidad Mágica Revelada
              </h3>
              <p className="text-xs text-amber-100/50">
                El oráculo ha analizado tus respuestas y decodificado tu sendero iniciático dominante.
              </p>
            </div>

            {/* Dominante */}
            <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-4xl shrink-0">
                {getResults().primary.emoji}
              </div>
              <div className="flex-1">
                <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono font-bold">
                  Sendero Dominante
                </span>
                <h4 className="text-base font-bold font-serif text-amber-300 mt-0.5">
                  {getResults().primary.name}
                </h4>
                <p className="text-xs text-amber-100/80 leading-relaxed font-sans mt-1">
                  {getResults().primary.description}
                </p>
              </div>
            </div>

            {/* Desglose de porcentajes */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono font-bold">
                Tu afinidad con todos los senderos
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getResults().percentages.map((p) => (
                  <div
                    key={p.key}
                    className="p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{p.emoji}</span>
                        <span className="text-amber-100/90 truncate max-w-[170px]">{p.name}</span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">{p.percent}%</span>
                    </div>
                    {/* Barra */}
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${p.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${p.percent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendaciones específicas */}
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex flex-col gap-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Recomendaciones para tu práctica
              </span>
              <ul className="flex flex-col gap-2 text-xs text-amber-100/60 pl-2">
                {getResults().primary.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-amber-500">•</span>
                    <p>{rec}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Controles de reinicio */}
            <button
              onClick={resetTest}
              className="mt-2 py-3 bg-zinc-900 border border-zinc-800 text-amber-200 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 hover:text-amber-100 hover:border-zinc-700 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Repetir Cuestionario
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
