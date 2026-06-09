import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, Sparkles } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

const ARCHETYPES = [
  { name: "La Sombra", icon: "🌑", desc: "El lado oscuro reprimido, impulsos inconscientes, el alter ego." },
  { name: "El Anima", icon: "🌸", desc: "En hombres: el principio femenino interior, intuición, emoción." },
  { name: "El Animus", icon: "⚔️", desc: "En mujeres: el principio masculino interior, razón, acción." },
  { name: "El Sí-mismo", icon: "☀️", desc: "La totalidad integrada, el centro del psique, meta de individuación." },
  { name: "La Persona", icon: "🎭", desc: "La máscara social, el rol adoptado ante el mundo exterior." },
  { name: "El Héroe", icon: "🦅", desc: "La fuerza que enfrenta el dragón (la sombra) para encontrar el tesoro." },
  { name: "El Anciano Sabio", icon: "🧙", desc: "El guía interior, la sabiduría acumulada, el Hermit del Tarot." },
  { name: "La Gran Madre", icon: "🌿", desc: "El principio nutricio y destructor a la vez, la naturaleza primordial." },
];

const COMMON_SYMBOLS = [
  { symbol: "Agua", meaning: "El inconsciente, emociones, el alma" },
  { symbol: "Fuego", meaning: "Transformación, pasión, el espíritu" },
  { symbol: "Casa", meaning: "La psique, el ser interior" },
  { symbol: "Serpiente", meaning: "Sabiduría, regeneración, kundalini" },
  { symbol: "Volar", meaning: "Liberación, perspectiva superior, escape" },
  { symbol: "Caer", meaning: "Miedo a perder control, transición" },
  { symbol: "Laberinto", meaning: "Confusión, búsqueda del centro del ser" },
  { symbol: "Espejo", meaning: "Autoconocimiento, el doble, la sombra" },
  { symbol: "Puerta", meaning: "Umbral, transición, oportunidades" },
  { symbol: "Océano", meaning: "El inconsciente colectivo, lo primordial" },
  { symbol: "Luna", meaning: "Intuición, ciclos, lo femenino" },
  { symbol: "Sol", meaning: "Consciencia, ego, el Sí-mismo" },
  { symbol: "Árbol", meaning: "El eje del mundo, crecimiento, el Árbol de la Vida" },
  { symbol: "Persecución", meaning: "Huir de la sombra, problema no resuelto" },
  { symbol: "Muerte en sueños", meaning: "Transformación, fin de fase, no muerte literal" },
  { symbol: "Niño", meaning: "El arquetipo del niño divino, inocencia, potencial" },
];

export function DreamView() {
  const [dream, setDream] = useState("");
  const [emotion, setEmotion] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dream.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    synthInstance.playChime(294, 2.0, "triangle");
    try {
      const data = await safeFetchJSON("/api/dream-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream, emotion, recurring })
      }, "Las imágenes del sueño se disuelven antes de ser descifradas.");
      setResult(data);
      synthInstance.playChime(440, 2.0, "sine");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto flex flex-col gap-6"
    >
      {/* Header + Form */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">🔮</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Análisis de Sueños — Interpretación Junguiana</h2>
            <p className="text-xs text-amber-100/60">Descifra el lenguaje simbólico del inconsciente a través de la psicología de Jung y el hermetismo</p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Describe tu Sueño en Detalle:</label>
            <textarea
              value={dream}
              onChange={e => setDream(e.target.value)}
              placeholder="Narra el sueño con tantos detalles como recuerdes: personajes, lugares, colores, sensaciones, acciones..."
              rows={5}
              required
              className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Emoción Predominante al Despertar:</label>
              <input
                type="text"
                value={emotion}
                onChange={e => setEmotion(e.target.value)}
                placeholder="Ej: Miedo, Alegría, Angustia, Paz, Confusión..."
                className="bg-zinc-950 border border-amber-500/25 rounded-xl py-2.5 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <label className="flex items-center gap-3 cursor-pointer bg-zinc-950 border border-amber-500/15 rounded-xl p-3 hover:border-amber-500/30 transition-all">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={e => setRecurring(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <div>
                  <div className="text-xs text-amber-200 font-semibold">¿Sueño Recurrente?</div>
                  <div className="text-[10px] text-zinc-500">Los sueños recurrentes tienen significado especial</div>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {loading ? "Descendiendo al inconsciente..." : "Interpretar Sueño"}
          </button>
        </form>

        {error && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {error}</div>}
      </div>

      {/* Common symbols quick reference */}
      <div className="bg-zinc-900/30 rounded-2xl border border-amber-500/10 p-5">
        <div className="text-[10px] text-amber-500/60 uppercase tracking-widest mb-3">📖 Diccionario Onírico Junguiano (referencia rápida)</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {COMMON_SYMBOLS.map(s => (
            <div key={s.symbol} className="bg-zinc-950/50 rounded-lg border border-amber-500/10 px-3 py-2">
              <div className="text-amber-300 text-[10px] font-bold">{s.symbol}</div>
              <div className="text-zinc-500 text-[9px] leading-tight mt-0.5">{s.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 flex flex-col items-center gap-4 border border-amber-500/10 rounded-2xl bg-zinc-900/10">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: "reverse" }} />
          </div>
          <p className="text-xs italic text-amber-400/80 animate-pulse">Descendiendo por los estratos del inconsciente...</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 flex flex-col gap-6"
        >
          <div className="border-b border-amber-500/10 pb-3">
            <div className="text-[10px] text-amber-500/60 uppercase tracking-widest">Análisis Junguiano-Hermético</div>
            <h3 className="text-base font-bold font-serif text-amber-400 mt-0.5">🔮 El Espejo del Inconsciente</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-serif leading-relaxed text-amber-100">
            {result.sinopsis_onirica && (
              <div className="md:col-span-2 p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">📖 Lectura Onírica General</div>
                <p className="italic border-l-2 border-amber-500/30 pl-3">{result.sinopsis_onirica}</p>
              </div>
            )}
            {result.arquetipos_presentes && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">🌑 Arquetipos Junguianos</div>
                <p>{result.arquetipos_presentes}</p>
              </div>
            )}
            {result.simbolos_hermeticos && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">✡️ Símbolos Herméticos</div>
                <p>{result.simbolos_hermeticos}</p>
              </div>
            )}
            {result.mensaje_inconsciente && (
              <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/15">
                <div className="text-amber-500 font-bold text-[10px] uppercase font-sans mb-2">⚡ Mensaje del Inconsciente</div>
                <p>{result.mensaje_inconsciente}</p>
              </div>
            )}
            {result.integracion_sombra && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">🌑 Trabajo con la Sombra</div>
                <p>{result.integracion_sombra}</p>
              </div>
            )}
            {result.practica_integradora && (
              <div className="md:col-span-2 p-4 bg-purple-500/5 rounded-xl border border-purple-500/20">
                <div className="text-purple-400 font-bold text-[10px] uppercase font-sans mb-2">🧘 Práctica de Integración</div>
                <p>{result.practica_integradora}</p>
              </div>
            )}
          </div>

          {result.oraculo_final && (
            <div className="text-center italic text-amber-300 border-t border-amber-500/10 pt-4 font-serif">
              "{result.oraculo_final}"
            </div>
          )}
        </motion.div>
      )}

      {/* Archetypes reference */}
      <div className="bg-zinc-900/30 rounded-2xl border border-amber-500/10 p-5">
        <div className="text-[10px] text-amber-500/60 uppercase tracking-widest mb-3">🌑 Los 8 Arquetipos Junguianos Principales</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ARCHETYPES.map(a => (
            <div key={a.name} className="bg-zinc-950/50 rounded-xl border border-amber-500/10 p-3">
              <div className="text-xl mb-1">{a.icon}</div>
              <div className="text-amber-300 text-[10px] font-bold">{a.name}</div>
              <p className="text-zinc-500 text-[9px] leading-tight mt-1 font-serif">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
