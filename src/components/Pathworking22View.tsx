import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, Clock, Play, Pause, RotateCcw, Info, BookOpen, Layers } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

interface Sefira {
  id: number;
  name: string;
  translation: string;
  cx: number;
  cy: number;
  color: string;
  bgColor: string;
  description: string;
}

const SEFIROT: Sefira[] = [
  { id: 1, name: "Keter", translation: "Corona", cx: 200, cy: 50, color: "text-zinc-100", bgColor: "bg-zinc-100/10 border-zinc-300", description: "La fuente primordial, la luz divina inmanifestada de la unidad cósmica." },
  { id: 2, name: "Chokmah", translation: "Sabiduría", cx: 285, cy: 110, color: "text-blue-400", bgColor: "bg-blue-950/20 border-blue-500", description: "El rayo de creación original, la energía masculina primordial, la intuición." },
  { id: 3, name: "Binah", translation: "Entendimiento", cx: 115, cy: 110, color: "text-indigo-400", bgColor: "bg-indigo-950/20 border-indigo-500", description: "La gran madre cósmica, la forma, la estructura y la asimilación intelectual." },
  { id: 4, name: "Chesed", translation: "Misericordia", cx: 285, cy: 200, color: "text-cyan-400", bgColor: "bg-cyan-950/20 border-cyan-500", description: "La expansión, el amor incondicional, la bondad y la generosidad cósmica." },
  { id: 5, name: "Gevurah", translation: "Rigor / Fuerza", cx: 115, cy: 200, color: "text-red-400", bgColor: "bg-red-950/20 border-red-500", description: "El límite, la disciplina, la fuerza purificadora y la justicia divina." },
  { id: 6, name: "Tiferet", translation: "Belleza", cx: 200, cy: 260, color: "text-yellow-400", bgColor: "bg-yellow-950/20 border-yellow-500", description: "El corazón del árbol, la armonía, la autoconciencia solar y el equilibrio." },
  { id: 7, name: "Netzach", translation: "Victoria", cx: 285, cy: 350, color: "text-emerald-400", bgColor: "bg-emerald-950/20 border-emerald-500", description: "La naturaleza, la emoción, el deseo, la victoria artística y el instinto." },
  { id: 8, name: "Hod", translation: "Esplendor", cx: 115, cy: 350, color: "text-orange-400", bgColor: "bg-orange-950/20 border-orange-500", description: "El intelecto analítico, la comunicación, la magia mental y el esplendor." },
  { id: 9, name: "Yesod", translation: "Fundamento", cx: 200, cy: 410, color: "text-purple-400", bgColor: "bg-purple-950/20 border-purple-500", description: "El subconsciente, la imaginación astral, la energía vital y los sueños." },
  { id: 10, name: "Malkuth", translation: "Reino", cx: 200, cy: 520, color: "text-amber-600", bgColor: "bg-amber-950/20 border-amber-800", description: "El mundo físico, el cuerpo, el templo de la materia manifestada." }
];

interface Path22 {
  id: number;
  letter: string;
  name: string;
  from: number; // Sefira ID
  to: number; // Sefira ID
  tarot: string;
  attribution: string;
  description: string;
  frequency: number; // frequency for meditation
}

const PATHS: Path22[] = [
  { id: 11, letter: "א", name: "Aleph", from: 1, to: 2, tarot: "El Loco", attribution: "Aire", frequency: 432, description: "El sendero del soplo divino. Conecta la Corona suprema con la Sabiduría cósmica mediante el potencial infinito." },
  { id: 12, letter: "ב", name: "Bet", from: 1, to: 3, tarot: "El Mago", attribution: "Mercurio", frequency: 528, description: "El sendero de la concentración mental y el poder de manifestar la voluntad divina." },
  { id: 13, letter: "ג", name: "Gimel", from: 1, to: 6, tarot: "La Sacerdotisa", attribution: "Luna", frequency: 396, description: "El cruce del Abismo. El sendero de la receptividad cósmica y los secretos del alma." },
  { id: 14, letter: "ד", name: "Dalet", from: 2, to: 3, tarot: "La Emperatriz", attribution: "Venus", frequency: 639, description: "La puerta del amor y la fertilidad mental. Une la sabiduría con la inteligencia." },
  { id: 15, letter: "ה", name: "He", from: 2, to: 6, tarot: "El Emperador", attribution: "Aries", frequency: 741, description: "El sendero del gobierno ordenado, el orden divino y la visión estructural." },
  { id: 16, letter: "ו", name: "Vav", from: 2, to: 4, tarot: "El Hierofante", attribution: "Tauro", frequency: 852, description: "El lazo o conexión que revela los misterios divinos al intelecto humano." },
  { id: 17, letter: "ז", name: "Zayin", from: 3, to: 6, tarot: "Los Amantes", attribution: "Géminis", frequency: 963, description: "El sendero de la polaridad unificada y el discernimiento de los caminos." },
  { id: 18, letter: "ח", name: "Chet", from: 3, to: 5, tarot: "El Carro", attribution: "Cáncer", frequency: 285, description: "El sendero del triunfo interno a través de la autodisciplina y el cobijo psíquico." },
  { id: 19, letter: "ט", name: "Tet", from: 4, to: 5, tarot: "La Fuerza", attribution: "Leo", frequency: 417, description: "La unión de la compasión con el rigor, domando el fuego animal interior." },
  { id: 20, letter: "י", name: "Yod", from: 4, to: 6, tarot: "El Ermitaño", attribution: "Virgo", frequency: 432, description: "El faro del maestro secreto y la introspección que brilla en el corazón." },
  { id: 21, letter: "כ", name: "Kaf", from: 4, to: 7, tarot: "Rueda de la Fortuna", attribution: "Júpiter", frequency: 528, description: "El sendero de los grandes ciclos evolutivos y la generosidad del cosmos." },
  { id: 22, letter: "ל", name: "Lamed", from: 5, to: 6, tarot: "La Justicia", attribution: "Libra", frequency: 639, description: "La balanza del karma que equilibra la fuerza del rigor con el corazón." },
  { id: 23, letter: "מ", name: "Mem", from: 5, to: 8, tarot: "El Colgado", attribution: "Agua", frequency: 741, description: "El sendero del sacrificio consciente y la visión invertida de la realidad terrenal." },
  { id: 24, letter: "נ", name: "Nun", from: 6, to: 7, tarot: "La Muerte", attribution: "Escorpio", frequency: 852, description: "El sendero de la transformación abrupta, el desapego y la metamorfosis espiritual." },
  { id: 25, letter: "ס", name: "Samekh", from: 6, to: 9, tarot: "La Templanza", attribution: "Sagitario", frequency: 963, description: "La flecha de luz que atraviesa el velo para alinear la conciencia solar con el fundamento astral." },
  { id: 26, letter: "ע", name: "Ayin", from: 6, to: 8, tarot: "El Diablo", attribution: "Capricornio", frequency: 396, description: "El sendero de la confrontación con el materialismo y las ilusiones que nos encadenan." },
  { id: 27, letter: "פ", name: "Pe", from: 7, to: 8, tarot: "La Torre", attribution: "Marte", frequency: 417, description: "La liberación forzada de la boca de la verdad que derriba murallas del ego." },
  { id: 28, letter: "צ", name: "Tzadi", from: 7, to: 9, tarot: "La Estrella", attribution: "Acuario", frequency: 432, description: "La lluvia purificadora del firmamento que nutre la imaginación intuitiva." },
  { id: 29, letter: "ק", name: "Qof", from: 7, to: 10, tarot: "La Luna", attribution: "Piscis", frequency: 528, description: "El descenso a las profundidades de la ilusión física y la noche oscura del alma." },
  { id: 30, letter: "ר", name: "Resh", from: 9, to: 8, tarot: "El Sol", attribution: "Sol", frequency: 639, description: "La claridad del intelecto despierto, la iluminación del sendero astral." },
  { id: 31, letter: "ש", name: "Shin", from: 8, to: 10, tarot: "El Juicio", attribution: "Fuego", frequency: 741, description: "La llamada del fuego purificador y la resurrección a una nueva conciencia espiritual." },
  { id: 32, letter: "ת", name: "Tav", from: 9, to: 10, tarot: "El Mundo", attribution: "Saturno", frequency: 852, description: "El sendero de entrada al árbol desde la materia, y la consagración cósmica final." }
];

export function Pathworking22View() {
  const [selectedPath, setSelectedPath] = useState<Path22 | null>(PATHS[0]);
  const [selectedSefira, setSelectedSefira] = useState<Sefira | null>(null);
  const [isMeditating, setIsMeditating] = useState(false);
  const [loadingNarrative, setLoadingNarrative] = useState(false);
  const [meditationData, setMeditationData] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isMeditating) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isMeditating]);

  const handleSelectPath = (path: Path22) => {
    setSelectedPath(path);
    setSelectedSefira(null);
    setMeditationData(null);
    setErrorStr("");
    setIsMeditating(false);
    setTimer(0);
    synthInstance.playChime(path.frequency, 0.5, "sine");
  };

  const handleSelectSefira = (sefira: Sefira) => {
    setSelectedSefira(sefira);
    setSelectedPath(null);
    setIsMeditating(false);
    synthInstance.playChime(330, 0.4, "sine");
  };

  const startMeditation = async () => {
    if (!selectedPath) return;
    setLoadingNarrative(true);
    setErrorStr("");
    setMeditationData(null);
    setIsMeditating(true);
    setTimer(0);

    // Start binaural tone using CelestialSynth
    synthInstance.playChime(selectedPath.frequency, 2.0, "sine");

    try {
      const data = await safeFetchJSON("/api/generate-pathworking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Sendero de ${selectedPath.name} (${selectedPath.letter}) - Tarot: ${selectedPath.tarot}`,
          focusType: selectedPath.attribution
        })
      }, "Falla al evocar el sendero astral.");
      setMeditationData(data);
    } catch (e: any) {
      setErrorStr(e.message || "La niebla astral bloqueó la comunión con el sendero.");
      setIsMeditating(false);
    } finally {
      setLoadingNarrative(false);
    }
  };

  const stopMeditation = () => {
    setIsMeditating(false);
    synthInstance.playChime(220, 0.8, "sine");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-6xl mx-auto"
    >
      {/* Columna Izquierda: El Árbol Interactivo */}
      <div className="lg:col-span-6 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 md:p-6 rounded-2xl border border-amber-500/10 flex flex-col items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 w-full border-b border-amber-500/10 pb-3">
          <Layers className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Árbol de la Vida Cabalístico
          </h3>
        </div>

        <p className="text-[10px] text-amber-100/40 text-center uppercase tracking-widest font-mono">
          Selecciona una Sefirá o un Sendero de unión
        </p>

        {/* El Diagrama SVG */}
        <svg className="w-full max-w-[360px] h-[540px] drop-shadow-[0_0_10px_rgba(245,158,11,0.05)]" viewBox="0 0 400 570">
          {/* Los Senderos (Líneas) */}
          {PATHS.map((p) => {
            const fromS = SEFIROT.find((s) => s.id === p.from);
            const toS = SEFIROT.find((s) => s.id === p.to);
            if (!fromS || !toS) return null;

            const isSelected = selectedPath?.id === p.id;

            return (
              <g key={p.id}>
                <line
                  x1={fromS.cx}
                  y1={fromS.cy}
                  x2={toS.cx}
                  y2={toS.cy}
                  stroke={isSelected ? "#f59e0b" : "#27272a"}
                  strokeWidth={isSelected ? "3" : "2"}
                  className="cursor-pointer transition-all hover:stroke-amber-500/60"
                  onClick={() => handleSelectPath(p)}
                />
                {/* Etiqueta de la Letra Hebrea en el punto medio */}
                <circle
                  cx={(fromS.cx + toS.cx) / 2}
                  cy={(fromS.cy + toS.cy) / 2}
                  r="10"
                  fill="#09090b"
                  stroke={isSelected ? "#f59e0b" : "#3f3f46"}
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handleSelectPath(p)}
                />
                <text
                  x={(fromS.cx + toS.cx) / 2}
                  y={(fromS.cy + toS.cy) / 2 + 3.5}
                  textAnchor="middle"
                  fill={isSelected ? "#f59e0b" : "#a1a1aa"}
                  fontSize="11"
                  className="cursor-pointer font-bold font-serif select-none"
                  onClick={() => handleSelectPath(p)}
                >
                  {p.letter}
                </text>
              </g>
            );
          })}

          {/* Las Sefirot (Esferas) */}
          {SEFIROT.map((s) => {
            const isSelected = selectedSefira?.id === s.id;
            return (
              <g key={s.id} onClick={() => handleSelectSefira(s)} className="cursor-pointer group">
                <circle
                  cx={s.cx}
                  cy={s.cy}
                  r="22"
                  className={`${s.bgColor} border transition-all ${
                    isSelected ? "border-amber-400 scale-105" : "group-hover:border-amber-500/50"
                  }`}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                />
                <text
                  x={s.cx}
                  y={s.cy - 1}
                  textAnchor="middle"
                  className={`text-[9px] font-bold tracking-wider font-serif ${s.color}`}
                >
                  {s.name}
                </text>
                <text
                  x={s.cx}
                  y={s.cy + 9}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="7"
                  className="uppercase tracking-widest font-mono"
                >
                  {s.translation}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Columna Derecha: Detalle de Selección / Portal Meditativo */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        <AnimatePresence mode="wait">
          {selectedPath && (
            <motion.div
              key="path-panel"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="bg-zinc-900/50 p-5 rounded-2xl border border-amber-500/15 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start border-b border-zinc-800/80 pb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-amber-500 font-mono font-bold">
                    Sendero {selectedPath.id} del Árbol
                  </span>
                  <h3 className="text-base font-bold font-serif text-amber-300">
                    Clave {selectedPath.letter} — {selectedPath.name}
                  </h3>
                </div>
                <span className="text-2xl font-serif text-amber-400">{selectedPath.letter}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/50">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Arcano Tarot</span>
                  <span className="text-amber-100 font-serif font-bold text-xs">{selectedPath.tarot}</span>
                </div>
                <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/50">
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">Atribución</span>
                  <span className="text-amber-100 font-bold text-xs">{selectedPath.attribution}</span>
                </div>
              </div>

              <p className="text-xs text-amber-100/70 font-serif leading-relaxed">
                {selectedPath.description}
              </p>

              {/* Portal de Meditación (Pathworking) */}
              {!isMeditating ? (
                <button
                  onClick={startMeditation}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold rounded-xl text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 border border-amber-400"
                >
                  <Compass className="w-4 h-4 animate-spin" /> Iniciar Pathworking (Astral)
                </button>
              ) : (
                <div className="border border-purple-500/20 bg-zinc-950 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none animate-pulse" />
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-purple-400 font-mono flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Proyección Astral Iniciada ({selectedPath.frequency}Hz)
                    </span>
                    <span className="font-mono text-zinc-500">{timer}s</span>
                  </div>

                  {loadingNarrative && (
                    <div className="py-8 flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-[11px] italic text-purple-400 animate-pulse">
                        Sintonizando la mente con la letra {selectedPath.letter}...
                      </p>
                    </div>
                  )}

                  {meditationData && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col gap-4 text-xs font-serif text-amber-100/80 leading-relaxed"
                    >
                      {meditationData.preparacion && (
                        <div>
                          <strong className="text-[10px] font-sans text-purple-300 uppercase block tracking-wider mb-0.5">
                            Preparación
                          </strong>
                          <p className="italic">{meditationData.preparacion}</p>
                        </div>
                      )}
                      {meditationData.rumbo && (
                        <div>
                          <strong className="text-[10px] font-sans text-purple-300 uppercase block tracking-wider mb-0.5">
                            Umbral del Sendero
                          </strong>
                          <p>{meditationData.rumbo}</p>
                        </div>
                      )}
                      {meditationData.viaje_narrativo && (
                        <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                          <strong className="text-[10px] font-sans text-amber-400 uppercase block tracking-wider mb-1">
                            El Viaje Astral
                          </strong>
                          <p className="text-justify whitespace-pre-line">{meditationData.viaje_narrativo}</p>
                        </div>
                      )}
                      {meditationData.comunion_ritual && (
                        <div>
                          <strong className="text-[10px] font-sans text-purple-300 uppercase block tracking-wider mb-0.5">
                            Comunión
                          </strong>
                          <p>{meditationData.comunion_ritual}</p>
                        </div>
                      )}
                      {meditationData.retorno && (
                        <div>
                          <strong className="text-[10px] font-sans text-purple-300 uppercase block tracking-wider mb-0.5">
                            Retorno Terrenal
                          </strong>
                          <p>{meditationData.retorno}</p>
                        </div>
                      )}
                      {meditationData.mantra_afirmacion && (
                        <div className="text-center italic text-sm font-sans font-bold text-amber-300 mt-2">
                          Mantra: "{meditationData.mantra_afirmacion}"
                        </div>
                      )}
                    </motion.div>
                  )}

                  {errorStr && (
                    <div className="text-xs text-red-400 bg-red-950/20 border border-red-500/30 p-3 rounded-lg">
                      ❌ {errorStr}
                    </div>
                  )}

                  <button
                    onClick={stopMeditation}
                    className="w-full py-2 border border-zinc-800 hover:border-red-500/30 text-xs text-zinc-400 hover:text-red-400 transition-all rounded-xl mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Pause className="w-3.5 h-3.5" /> Detener Meditación y Retornar
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {selectedSefira && (
            <motion.div
              key="sefira-panel"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="bg-zinc-900/50 p-5 rounded-2xl border border-amber-500/10 flex flex-col gap-4"
            >
              <div className="border-b border-zinc-800 pb-3">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono font-bold">
                  Sefirá {selectedSefira.id} / 10
                </span>
                <h3 className="text-base font-bold font-serif text-amber-300">
                  {selectedSefira.name} ({selectedSefira.translation})
                </h3>
              </div>
              <p className="text-xs text-amber-100/70 font-serif leading-relaxed">
                {selectedSefira.description}
              </p>
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-xs text-zinc-500 font-sans flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  Las Sefirot son los 10 centros de emanación divina del Árbol de la Vida. Para hacer
                  pathworking, selecciona las líneas negras (los 22 Senderos) que conectan las esferas entre sí.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
