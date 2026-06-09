import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

// Comprehensive static correspondences database
const OBJECTIVES = [
  { id: "amor", label: "💕 Amor & Relaciones", planet: "Venus ♀", day: "Viernes", color: "Rosa / Verde", number: 7, sefira: "Netzaj (נצח)", arcano: "VI Los Amantes", element: "Agua", incense: "Rosa, Jazmín", crystal: "Cuarzo Rosa, Rodocrosita", herb: "Rosa, Lavanda, Melisa", deity: "Afrodita, Ishtar, Venus", metal: "Cobre" },
  { id: "prosperidad", label: "💰 Prosperidad & Abundancia", planet: "Júpiter ♃", day: "Jueves", color: "Azul / Verde", number: 4, sefira: "Jesed (חסד)", arcano: "X Rueda de la Fortuna", element: "Tierra", incense: "Cedro, Patchouli", crystal: "Citrino, Pirita", herb: "Albahaca, Laurel, Canela", deity: "Zeus, Júpiter, Lakshmi", metal: "Estaño" },
  { id: "proteccion", label: "🛡️ Protección & Destierro", planet: "Saturno ♄", day: "Sábado", color: "Negro / Blanco", number: 3, sefira: "Binah (בינה)", arcano: "XXI El Mundo", element: "Tierra/Fuego", incense: "Dragón de Sangre, Mirra", crystal: "Turmalina Negra, Obsidiana", herb: "Salvia, Ruda, Ajo", deity: "Hécate, Ares, Marte", metal: "Plomo/Hierro" },
  { id: "sabiduria", label: "📚 Sabiduría & Conocimiento", planet: "Mercurio ☿", day: "Miércoles", color: "Naranja / Amarillo", number: 8, sefira: "Hod (הוד)", arcano: "I El Mago", element: "Aire", incense: "Sándalo, Incienso", crystal: "Lapislázuli, Fluorita", herb: "Romero, Ginkgo, Salvia", deity: "Hermes, Thoth, Sarasvati", metal: "Mercurio" },
  { id: "salud", label: "💚 Salud & Vitalidad", planet: "Sol ☉", day: "Domingo", color: "Dorado / Naranja", number: 6, sefira: "Tiphereth (תפארת)", arcano: "XIX El Sol", element: "Fuego", incense: "Olíbano, Naranja", crystal: "Citrino, Ámbar, Ojo de Tigre", herb: "Girasol, Manzanilla, Angélica", deity: "Apolo, Ra, Helios", metal: "Oro" },
  { id: "intuicion", label: "🔮 Intuición & Psíquico", planet: "Luna ☽", day: "Lunes", color: "Blanco / Plateado", number: 9, sefira: "Yesod (יסוד)", arcano: "XVIII La Luna", element: "Agua", incense: "Jazmín, Alcanfor, Loto", crystal: "Piedra de Luna, Selenita", herb: "Artemisa, Valeriana, Maracuyá", deity: "Artemisa, Hécate, Selene", metal: "Plata" },
  { id: "fuerza", label: "💪 Fuerza & Valentía", planet: "Marte ♂", day: "Martes", color: "Rojo / Escarlata", number: 5, sefira: "Geburah (גבורה)", arcano: "XI La Fuerza", element: "Fuego", incense: "Pimienta Negra, Jengibre", crystal: "Granate, Cornalina", herb: "Jengibre, Pimienta, Cardo", deity: "Marte, Ares, Durga", metal: "Hierro" },
  { id: "comunicacion", label: "🗣️ Comunicación & Creatividad", planet: "Mercurio ☿", day: "Miércoles", color: "Amarillo / Naranja", number: 1, sefira: "Hod (הוד)", arcano: "I El Mago", element: "Aire", incense: "Menta, Benjuí", crystal: "Citrino, Calcita Naranja", herb: "Menta, Tomillo, Bergamota", deity: "Hermes, Apolo, Sarasvati", metal: "Mercurio" },
];

const HORA_PLANETARIA = ["Saturno", "Júpiter", "Marte", "Sol", "Venus", "Mercurio", "Luna"];

function getHoraPlanetaria(): { hora: number; planeta: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Dom
  const hour = now.getHours();
  // Planetary hours formula
  const rulers = [0, 1, 2, 3, 4, 5, 6]; // Sun=0, Mon=1...
  const dayRuler = [3, 6, 2, 0, 4, 5, 1][dayOfWeek]; // Sol, Luna, Marte, Mer, Jup, Ven, Sat
  const planetIdx = (dayRuler + hour) % 7;
  return { hora: hour, planeta: HORA_PLANETARIA[planetIdx] };
}

export function CorrespondencesView() {
  const [selectedObj, setSelectedObj] = useState(OBJECTIVES[0]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRitual, setAiRitual] = useState<any>(null);
  const [customObj, setCustomObj] = useState("");
  const [error, setError] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const horaActual = getHoraPlanetaria();

  const handleGetRitual = async () => {
    setAiLoading(true);
    setError("");
    setAiRitual(null);
    synthInstance.playChime(370, 2.0, "triangle");
    try {
      const data = await safeFetchJSON("/api/correspondencias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objetivo: showCustom ? customObj : selectedObj.label,
          correspondencias: showCustom ? {} : {
            planeta: selectedObj.planet,
            sefira: selectedObj.sefira,
            element: selectedObj.element
          }
        })
      }, "Las tablas de Thoth no responden en este instante.");
      setAiRitual(data);
      synthInstance.playChime(523, 2.0, "sine");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">⚡</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Correspondencias Mágicas</h2>
            <p className="text-xs text-amber-100/60">«Quiero X objetivo → ¿Qué ritual?» · Tablas de correspondencia esotérica completas</p>
          </div>
          {/* Current planetary hour */}
          <div className="ml-auto text-right">
            <div className="text-[9px] text-amber-500/50 uppercase tracking-widest">Hora Planetaria Actual</div>
            <div className="text-xs font-bold text-amber-300">{horaActual.planeta}</div>
            <div className="text-[9px] text-zinc-500">{horaActual.hora}:00 hs</div>
          </div>
        </div>

        {/* Objective selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {OBJECTIVES.map(obj => (
            <button
              key={obj.id}
              onClick={() => { setSelectedObj(obj); setShowCustom(false); setAiRitual(null); synthInstance.playChime(330, 0.4); }}
              className={`px-3 py-2.5 rounded-xl border text-left text-xs transition-all ${!showCustom && selectedObj.id === obj.id ? "border-amber-500/50 bg-amber-500/10 text-amber-300" : "border-zinc-800 hover:border-amber-500/20 text-zinc-400"}`}
            >
              {obj.label}
            </button>
          ))}
          <button
            onClick={() => { setShowCustom(true); setAiRitual(null); }}
            className={`px-3 py-2.5 rounded-xl border text-left text-xs transition-all ${showCustom ? "border-purple-500/50 bg-purple-500/10 text-purple-300" : "border-zinc-800 hover:border-purple-500/20 text-zinc-400"}`}
          >
            🗝️ Objetivo Personalizado
          </button>
        </div>

        {showCustom && (
          <input
            type="text"
            value={customObj}
            onChange={e => setCustomObj(e.target.value)}
            placeholder="Describe tu objetivo: ej. conseguir trabajo, encontrar mi propósito, sanar relación..."
            className="bg-zinc-950 border border-purple-500/25 rounded-xl py-2.5 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-purple-400"
          />
        )}
      </div>

      {/* Correspondences table */}
      {!showCustom && (
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/20 p-6">
          <div className="flex items-center gap-2 border-b border-amber-500/10 pb-3 mb-4">
            <span className="text-2xl">{selectedObj.label.split(" ")[0]}</span>
            <div>
              <div className="text-sm font-bold font-serif text-amber-400">{selectedObj.label}</div>
              <div className="text-[10px] text-zinc-500">Tablas de Correspondencia Hermética Completa</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "🪐 Planeta Regente", value: selectedObj.planet },
              { label: "📅 Día Óptimo", value: selectedObj.day },
              { label: "🎨 Color Mágico", value: selectedObj.color },
              { label: "🔢 Número", value: String(selectedObj.number) },
              { label: "🌳 Sefirá", value: selectedObj.sefira },
              { label: "🃏 Arcano Mayor", value: selectedObj.arcano },
              { label: "🔥 Elemento", value: selectedObj.element },
              { label: "⚗️ Metal", value: selectedObj.metal },
              { label: "🌿 Deidad/es", value: selectedObj.deity },
            ].map(({ label, value }) => (
              <div key={label} className="bg-zinc-950 rounded-xl border border-amber-500/10 p-3">
                <div className="text-[10px] text-amber-500/70 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-xs text-amber-100/90 font-serif">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            {[
              { label: "🌿 Hierbas & Plantas", value: selectedObj.herb },
              { label: "🔮 Cristales", value: selectedObj.crystal },
              { label: "💨 Inciensos", value: selectedObj.incense },
            ].map(({ label, value }) => (
              <div key={label} className="bg-zinc-950 rounded-xl border border-amber-500/10 p-3">
                <div className="text-[10px] text-amber-500/70 uppercase tracking-wider mb-1">{label}</div>
                <div className="text-xs text-amber-100/90 font-serif">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Ritual button */}
      <button
        onClick={handleGetRitual}
        disabled={aiLoading || (showCustom && !customObj.trim())}
        className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/20 hover:border-amber-500/40 disabled:opacity-40 rounded-xl text-xs tracking-wider uppercase text-amber-300 transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
        {aiLoading ? "Consultando Tablas de Thoth..." : "Generar Ritual Personalizado con IA"}
        {!aiLoading && <ArrowRight className="w-4 h-4" />}
      </button>

      {error && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {error}</div>}

      {/* AI Ritual result */}
      <AnimatePresence>
        {aiRitual && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 flex flex-col gap-5 font-serif text-xs leading-relaxed"
          >
            <div className="border-b border-amber-500/10 pb-3">
              <div className="text-[10px] text-amber-500/60 uppercase tracking-widest">⚡ Ritual Generado</div>
              <h3 className="text-sm font-bold font-serif text-amber-400 mt-0.5">
                {showCustom ? customObj : selectedObj.label}
              </h3>
            </div>

            {aiRitual.propicio && (
              <div className="bg-amber-500/5 rounded-xl border border-amber-500/10 p-4">
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">⏰ Momento Propicio</div>
                <p>{aiRitual.propicio}</p>
              </div>
            )}
            {aiRitual.preparacion && (
              <div>
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">🌿 Materiales y Preparación</div>
                <p>{aiRitual.preparacion}</p>
              </div>
            )}
            {aiRitual.ritual && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/15">
                <div className="text-amber-500 font-bold text-[10px] uppercase font-sans mb-2">🕯️ El Ritual Paso a Paso</div>
                <p className="whitespace-pre-line">{aiRitual.ritual}</p>
              </div>
            )}
            {aiRitual.cierre && (
              <div>
                <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">🔐 Cierre y Sellado</div>
                <p>{aiRitual.cierre}</p>
              </div>
            )}
            {aiRitual.mantra && (
              <div className="text-center italic text-amber-300 border-t border-amber-500/10 pt-4">
                "{aiRitual.mantra}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
