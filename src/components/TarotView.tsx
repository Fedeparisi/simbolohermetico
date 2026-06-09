import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shuffle, Sparkles, RotateCcw } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

// ─── Full 78-card Tarot database ───────────────────────────────────────────
export interface TarotCard {
  id: string;
  name: string;
  suit: "major" | "wands" | "cups" | "swords" | "pentacles";
  number: number;
  emoji: string;
  keywords: string[];
  upright: string;
  reversed: string;
  image?: string; // path to public/tarot/
}

const MAJOR_ARCANA: TarotCard[] = [
  { id: "major_00", name: "El Loco", suit: "major", number: 0, emoji: "🃏", keywords: ["inicio", "libertad", "ingenuidad", "potencial"], upright: "Comienzo de un viaje, espontaneidad, libertad del alma.", reversed: "Imprudencia, caos, negligencia espiritual." },
  { id: "major_01", name: "El Mago", suit: "major", number: 1, emoji: "🪄", keywords: ["voluntad", "poder", "manifestación", "habilidad"], upright: "Poder de manifestación, dominio de los cuatro elementos, voluntad creadora.", reversed: "Manipulación, engaño, potencial no usado." },
  { id: "major_02", name: "La Sacerdotisa", suit: "major", number: 2, emoji: "🌙", keywords: ["misterio", "intuición", "subconsciente", "gnosis"], upright: "Sabiduría oculta, intuición profunda, acceso al subconsciente.", reversed: "Secretos ocultos, desconexión con la intuición." },
  { id: "major_03", name: "La Emperatriz", suit: "major", number: 3, emoji: "🌿", keywords: ["fertilidad", "naturaleza", "abundancia", "madre"], upright: "Abundancia, fertilidad, conexión con la naturaleza, creatividad.", reversed: "Bloqueo creativo, dependencia, neglecta de uno mismo." },
  { id: "major_04", name: "El Emperador", suit: "major", number: 4, emoji: "👑", keywords: ["autoridad", "estructura", "padre", "orden"], upright: "Autoridad, estructura, poder terrenal, padre arquetípico.", reversed: "Rigidez, tiranía, pérdida de control." },
  { id: "major_05", name: "El Hierofante", suit: "major", number: 5, emoji: "⛪", keywords: ["tradición", "enseñanza", "religión", "guía"], upright: "Tradición espiritual, mentor, instituciones sagradas.", reversed: "Dogmatismo, rebelión contra normas, caminos no convencionales." },
  { id: "major_06", name: "Los Amantes", suit: "major", number: 6, emoji: "💞", keywords: ["amor", "elección", "valores", "unión"], upright: "Unión sagrada, elección profunda, alineación con valores.", reversed: "Desalineación, desacuerdo interno, elecciones difíciles." },
  { id: "major_07", name: "El Carro", suit: "major", number: 7, emoji: "⚔️", keywords: ["victoria", "control", "voluntad", "determinación"], upright: "Victoria a través de la determinación, control de fuerzas opuestas.", reversed: "Pérdida de control, agresión, falta de dirección." },
  { id: "major_08", name: "La Fuerza", suit: "major", number: 8, emoji: "🦁", keywords: ["valor", "compasión", "paciencia", "control interno"], upright: "Fuerza interior, valentía compasiva, dominio de instintos.", reversed: "Falta de autoconfianza, debilidad, impulsos incontrolados." },
  { id: "major_09", name: "El Ermitaño", suit: "major", number: 9, emoji: "🕯️", keywords: ["soledad", "guía", "búsqueda interna", "sabiduría"], upright: "Retiro espiritual, sabiduría interior, guía del alma.", reversed: "Aislamiento excesivo, rechazo de ayuda, pérdida de rumbo." },
  { id: "major_10", name: "Rueda de la Fortuna", suit: "major", number: 10, emoji: "⚙️", keywords: ["destino", "ciclos", "karma", "cambio"], upright: "Giro del destino, buena fortuna, ciclos del karma.", reversed: "Mala suerte, resistencia al cambio, inestabilidad." },
  { id: "major_11", name: "La Justicia", suit: "major", number: 11, emoji: "⚖️", keywords: ["equilibrio", "verdad", "ley", "consecuencia"], upright: "Equilibrio cósmico, verdad, causa y efecto.", reversed: "Injusticia, deshonestidad, evitar consecuencias." },
  { id: "major_12", name: "El Colgado", suit: "major", number: 12, emoji: "🙃", keywords: ["sacrificio", "perspectiva", "pausa", "iluminación"], upright: "Suspensión, nueva perspectiva, sacrificio voluntario.", reversed: "Retraso, resistencia, martirio innecesario." },
  { id: "major_13", name: "La Muerte", suit: "major", number: 13, emoji: "🌑", keywords: ["transformación", "fin", "transición", "renovación"], upright: "Transformación profunda, fin de un ciclo, renacimiento.", reversed: "Resistencia al cambio, estancamiento, miedo a lo desconocido." },
  { id: "major_14", name: "La Templanza", suit: "major", number: 14, emoji: "🌊", keywords: ["moderación", "equilibrio", "paciencia", "propósito"], upright: "Moderación, equilibrio, integración de opuestos.", reversed: "Excesos, desequilibrio, desproporción." },
  { id: "major_15", name: "El Diablo", suit: "major", number: 15, emoji: "🔗", keywords: ["sombra", "apego", "materia", "ilusión"], upright: "Apego a lo material, sombra, ilusión de las cadenas.", reversed: "Liberación, romper cadenas, enfrentando la sombra." },
  { id: "major_16", name: "La Torre", suit: "major", number: 16, emoji: "⚡", keywords: ["caos", "revelación", "destrucción", "verdad"], upright: "Ruptura súbita, revelación, destrucción de falsas estructuras.", reversed: "Evitar el desastre, temor al cambio.", image: "/tarot/tarot_major_16_tower.png" },
  { id: "major_17", name: "La Estrella", suit: "major", number: 17, emoji: "⭐", keywords: ["esperanza", "inspiración", "renovación", "fe"], upright: "Esperanza, guía, renovación espiritual, fe en el universo.", reversed: "Desesperación, falta de fe, desconexión.", image: "/tarot/tarot_major_17_star.png" },
  { id: "major_18", name: "La Luna", suit: "major", number: 18, emoji: "🌕", keywords: ["ilusión", "misterio", "inconsciente", "sueños"], upright: "Misterio, ilusión, viaje al inconsciente, sueños proféticos.", reversed: "Confusión, miedo, distorsión de la realidad.", image: "/tarot/tarot_major_18_moon.png" },
  { id: "major_19", name: "El Sol", suit: "major", number: 19, emoji: "☀️", keywords: ["alegría", "vitalidad", "éxito", "iluminación"], upright: "Éxito, vitalidad, iluminación, alegría pura.", reversed: "Ego inflado, perspectivas negativas, dificultades.", image: "/tarot/tarot_major_19_sun.png" },
  { id: "major_20", name: "El Juicio", suit: "major", number: 20, emoji: "📯", keywords: ["despertar", "renovación", "absolución", "juicio"], upright: "Despertar espiritual, llamado del alma, renovación.", reversed: "Dudas, rechazo al llamado, miedo al juicio.", image: "/tarot/tarot_major_20_judgement.png" },
  { id: "major_21", name: "El Mundo", suit: "major", number: 21, emoji: "🌍", keywords: ["completud", "integración", "éxito", "totalidad"], upright: "Completud, integración, éxito total, el final de un ciclo.", reversed: "Incompletud, falta de cierre, estancamiento.", image: "/tarot/tarot_major_21_world.png" },
];

function makeMinor(suit: "wands" | "cups" | "swords" | "pentacles", emoji: string, meanings: string[][]): TarotCard[] {
  const names = ["As", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez", "Sota", "Caballero", "Reina", "Rey"];
  const suitName = { wands: "Bastos", cups: "Copas", swords: "Espadas", pentacles: "Oros" }[suit];
  const kw = {
    wands: ["fuego", "pasión", "acción", "creatividad"],
    cups: ["agua", "emoción", "intuición", "amor"],
    swords: ["aire", "intelecto", "conflicto", "verdad"],
    pentacles: ["tierra", "material", "trabajo", "abundancia"]
  }[suit];
  return names.map((n, i) => ({
    id: `${suit}_${String(i + 1).padStart(2, "0")}`,
    name: `${n} de ${suitName}`,
    suit,
    number: i + 1,
    emoji,
    keywords: kw,
    upright: meanings[i]?.[0] || "Energía del palo en este número.",
    reversed: meanings[i]?.[1] || "Bloqueo de la energía.",
    image: `/tarot/tarot_${suit}_${String(i + 1).padStart(2, "0")}.jpeg`
  }));
}

const WANDS_MEANINGS = [
  ["Inicio, inspiración, potencial de fuego.","Falso inicio, demoras."],
  ["Planificación, visión de futuro.","Impaciencia, miedo al desconocido."],
  ["Expansión, primeros éxitos.","Retrasos, falta de ambición."],
  ["Celebración, estabilidad temporaria.","Inestabilidad, falta de apoyo."],
  ["Conflicto, competencia.","Evitar conflicto, agresión."],
  ["Victoria, reconocimiento público.","Caída del ego, falta de confianza."],
  ["Defensa, perseverancia.","Capitulación, rendirse."],
  ["Movimiento rápido, noticias.","Demoras, frustración."],
  ["Resistencia, guardia alta.","Falta de flexibilidad, rigidez."],
  ["Carga pesada, responsabilidad.","Dificultad para delegar."],
  ["Aventura, exploración.","Impulsividad, falta de dirección."],
  ["Energía impetuosa, rapidez.","Precipitación, agresividad."],
  ["Liderazgo, carisma.","Egoísmo, dominancia excesiva."],
  ["Visión, inspiración creadora.","Tiranía, incapacidad de delegar."],
];
const CUPS_MEANINGS = [
  ["Nuevo amor, oferta emocional.","Bloqueo emocional, vacío."],
  ["Conexión, sociedad emocional.","Desequilibrio, ruptura."],
  ["Celebración, amistad.","Excesos, triángulo amoroso."],
  ["Contemplación, desilusión.","Nuevas perspectivas, aprovechar oportunidades."],
  ["Pérdida, arrepentimiento.","Superar el dolor, aceptación."],
  ["Nostalgia, inocencia.","Vivir en el pasado."],
  ["Ilusión, fantasía.","Claridad, desilusión."],
  ["Abandono de lo emocional.","Incapacidad de soltar."],
  ["Satisfacción, deseo cumplido.","Insatisfacción."],
  ["Plenitud emocional, familia.","Conflicto familiar, desilusión."],
  ["Sensibilidad, mensajes del corazón.","Fantasía excesiva."],
  ["Romance, idealismo.","Ilusión amorosa, decepción."],
  ["Intuición profunda, compasión.","Codependencia."],
  ["Maestría emocional, diplomacia.","Manipulación emocional."],
];
const SWORDS_MEANINGS = [
  ["Triunfo, claridad, poder mental.","Confusión, destrucción."],
  ["Parálisis, punto muerto.","Dilema resuelto, indecisión."],
  ["Dolor, separación.","Superación del dolor."],
  ["Descanso, recuperación.","Agitación, descanso postergado."],
  ["Victoria vacía, derrota.","Evitar el conflicto."],
  ["Transición, recuperación.","Estancamiento, apego al pasado."],
  ["Engaño, estrategia.","Confesión, enfrentamiento."],
  ["Restricción, limitación mental.","Liberación, nuevas perspectivas."],
  ["Angustia, pesadillas.","Esperanza, salida del túnel."],
  ["Final doloroso, crisis.","Recuperación, supervivencia."],
  ["Curiosidad, intelecto.","Imprudencia, chismes."],
  ["Acción impetuosa, lógica.","Impulsividad peligrosa."],
  ["Inteligencia aguda, independencia.","Frialdad, amargura."],
  ["Autoridad intelectual, claridad.","Crueldad, abuso de poder."],
];
const PENTACLES_MEANINGS = [
  ["Oportunidad material, prosperidad.","Oportunidad perdida."],
  ["Malabarismo, adaptabilidad.","Desequilibrio, caos."],
  ["Trabajo en equipo, maestría.","Falta de cohesión."],
  ["Posesividad, seguridad.","Avaricia, inseguridad financiera."],
  ["Pérdida material, pobreza.","Recuperación, encontrar recursos."],
  ["Generosidad, caridad.","Deudas, egoísmo."],
  ["Paciencia, inversión.","Impaciencia, falta de recompensa."],
  ["Artesanía, habilidad.","Trabajo sin resultados."],
  ["Independencia, lujo.","Dependencia excesiva."],
  ["Herencia, legado familiar.","Pérdida financiera."],
  ["Estudiante, aprendizaje práctico.","Falta de concentración."],
  ["Trabajo confiable, metódico.","Aburrimiento, estancamiento."],
  ["Nutricia, práctica, generosa.","Desbalance trabajo/hogar."],
  ["Abundancia, realización material.","Obsesión con el dinero."],
];

const ALL_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA.map(card => ({
    ...card,
    image: `/tarot/tarot_major_${String(card.number).padStart(2, "0")}.jpeg`
  })),
  ...makeMinor("wands", "🔥", WANDS_MEANINGS),
  ...makeMinor("cups", "🏆", CUPS_MEANINGS),
  ...makeMinor("swords", "⚔️", SWORDS_MEANINGS),
  ...makeMinor("pentacles", "💰", PENTACLES_MEANINGS),
];

const SPREAD_TYPES = [
  { id: "one", label: "Una Carta", desc: "Mensaje del día", count: 1, positions: ["Mensaje del Día"] },
  { id: "three", label: "Tres Cartas", desc: "Pasado · Presente · Futuro", count: 3, positions: ["Pasado", "Presente", "Futuro"] },
  { id: "horseshoe", label: "Herradura", desc: "7 cartas — Perspectiva amplia", count: 7, positions: ["Pasado", "Situación actual", "Futuro cercano", "El buscador", "Influencias externas", "Esperanzas y miedos", "Resultado final"] },
  { id: "celtic", label: "Cruz Celta", desc: "10 cartas — Análisis completo", count: 10, positions: ["La situación central", "El desafío/cruce", "La base subconsciente", "El pasado reciente", "La corona/posibilidad", "El futuro próximo", "El buscador", "Influencias externas", "Esperanzas/temores", "Resultado final"] },
];

function shuffle(arr: TarotCard[]): TarotCard[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface DrawnCard { card: TarotCard; reversed: boolean; }

export function TarotView() {
  const [spreadType, setSpreadType] = useState(SPREAD_TYPES[1]); // Default to 3 cards (Pasado, Presente, Futuro)
  const [question, setQuestion] = useState("");
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReading, setAiReading] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedCard, setSelectedCard] = useState<DrawnCard | null>(null);

  const doShuffle = () => {
    const shuffled = shuffle(ALL_CARDS).slice(0, spreadType.count);
    const cards: DrawnCard[] = shuffled.map(card => ({
      card,
      reversed: Math.random() > 0.7
    }));
    setDrawn(cards);
    setRevealed(new Array(spreadType.count).fill(false));
    setAiReading(null);
    setSelectedCard(null);
    setError("");
    synthInstance.playChime(330, 1.5, "triangle");
  };

  const revealCard = (i: number) => {
    setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
    synthInstance.playChime(370 + i * 30, 1.0, "sine");
  };

  const revealAll = () => {
    setRevealed(new Array(drawn.length).fill(true));
    synthInstance.playChime(440, 1.5, "sine");
  };

  const handleAIReading = async () => {
    if (drawn.length === 0) return;
    setAiLoading(true);
    setError("");
    synthInstance.playChime(294, 2.0, "triangle");
    try {
      const data = await safeFetchJSON("/api/tarot-reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          spread: spreadType.label,
          cards: drawn.map((d, i) => ({
            position: spreadType.positions[i],
            name: d.card.name,
            reversed: d.reversed
          }))
        })
      }, "Las sibilas callaron. El oráculo duerme.");
      setAiReading(data);
      synthInstance.playChime(523, 2.5, "sine");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const suitColor = (suit: string) => ({
    major: "border-amber-500/40 bg-amber-500/5",
    wands: "border-orange-500/40 bg-orange-500/5",
    cups: "border-blue-500/40 bg-blue-500/5",
    swords: "border-slate-500/40 bg-slate-500/5",
    pentacles: "border-emerald-500/40 bg-emerald-500/5",
  }[suit] || "border-amber-500/20");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto flex flex-col gap-6"
    >
      {/* Header + Controls */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">🃏</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Tarot Interactivo — 78 Cartas</h2>
            <p className="text-xs text-amber-100/60">Tiradas con interpretación hermética profunda · Baraja Rider-Waite-Smith</p>
          </div>
        </div>

        {/* Spread selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SPREAD_TYPES.map(s => (
            <button
              key={s.id}
              onClick={() => { setSpreadType(s); setDrawn([]); setRevealed([]); }}
              className={`p-3 rounded-xl border text-left transition-all ${spreadType.id === s.id ? "border-amber-500/40 bg-amber-500/10" : "border-zinc-800 bg-zinc-900/30 hover:border-amber-500/20"}`}
            >
              <div className="text-xs font-bold text-amber-300">{s.label}</div>
              <div className="text-[10px] text-zinc-500">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Question */}
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Formulación de la pregunta (opcional): ¿Qué debo saber sobre...?"
          className="bg-zinc-950 border border-amber-500/15 rounded-xl py-2.5 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
        />

        <button
          onClick={doShuffle}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Barajar y Tirar ({spreadType.count} carta{spreadType.count > 1 ? "s" : ""})
        </button>
      </div>

      {/* Drawn Cards */}
      <AnimatePresence>
        {drawn.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="text-[10px] text-amber-500/60 uppercase tracking-widest">
                Tirada: {spreadType.label} — {question ? `"${question.slice(0, 50)}..."` : "Sin pregunta específica"}
              </div>
              {revealed.some(r => !r) && (
                <button onClick={revealAll} className="text-[10px] text-amber-400 hover:text-amber-300 border border-amber-500/20 px-3 py-1 rounded-lg transition-all">
                  Revelar todas
                </button>
              )}
            </div>

            <div className={`grid gap-3 ${spreadType.count === 1 ? "grid-cols-1 max-w-xs mx-auto" : spreadType.count <= 3 ? "grid-cols-3" : spreadType.count <= 7 ? "grid-cols-4 md:grid-cols-7" : "grid-cols-5 md:grid-cols-10"}`}>
              {drawn.map((dc, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col gap-1"
                >
                  <div className="text-[9px] text-amber-500/50 uppercase tracking-widest text-center truncate">{spreadType.positions[i]}</div>
                  <button
                    onClick={() => {
                      if (!revealed[i]) revealCard(i);
                      else setSelectedCard(dc);
                    }}
                    className={`aspect-[2/3] rounded-xl border-2 flex flex-col items-center justify-center p-0 transition-all relative overflow-hidden ${revealed[i] ? suitColor(dc.card.suit) + " hover:brightness-110" : "border-amber-500/20 bg-gradient-to-b from-amber-900/20 to-zinc-900 cursor-pointer hover:border-amber-500/50"}`}
                  >
                    {dc.card.image && revealed[i] ? (
                      <img
                        src={dc.card.image}
                        alt={dc.card.name}
                        className={`w-full h-full object-contain bg-zinc-950/40 ${dc.reversed ? "rotate-180" : ""}`}
                      />
                    ) : revealed[i] ? (
                      <div className="p-2 flex flex-col items-center justify-center gap-1">
                        <div className={`text-2xl ${dc.reversed ? "rotate-180" : ""}`}>{dc.card.emoji}</div>
                        <div className="text-[9px] text-amber-200 font-bold text-center leading-tight">{dc.card.name}</div>
                        {dc.reversed && <div className="text-[8px] text-red-400/80 uppercase tracking-widest">invertida</div>}
                      </div>
                    ) : (
                      <img
                        src="/tarot/tarot_back.jpeg"
                        alt="Reverso"
                        className="w-full h-full object-contain bg-zinc-950/20"
                      />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Selected card detail */}
            <AnimatePresence>
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-zinc-900/70 p-5 rounded-xl border border-amber-500/20 flex gap-5"
                >
                  {selectedCard.card.image ? (
                    <img src={selectedCard.card.image} alt={selectedCard.card.name} className={`w-20 rounded-lg border border-amber-500/20 ${selectedCard.reversed ? "rotate-180" : ""}`} />
                  ) : (
                    <div className={`text-5xl ${selectedCard.reversed ? "rotate-180" : ""}`}>{selectedCard.card.emoji}</div>
                  )}
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-serif text-amber-400">{selectedCard.card.name}</span>
                      {selectedCard.reversed && <span className="text-[10px] bg-red-950/30 border border-red-500/30 text-red-400 px-2 py-0.5 rounded uppercase">Invertida</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCard.card.keywords.map(k => (
                        <span key={k} className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">{k}</span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-100/80 font-serif leading-relaxed">
                      {selectedCard.reversed ? selectedCard.card.reversed : selectedCard.card.upright}
                    </p>
                  </div>
                  <button onClick={() => setSelectedCard(null)} className="text-zinc-600 hover:text-amber-400 self-start">✕</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Reading */}
            {revealed.every(r => r) && (
              <button
                onClick={handleAIReading}
                disabled={aiLoading}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-xs tracking-wider uppercase text-amber-300 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                {aiLoading ? "Las sibilas leen el destino..." : "Interpretación Hermética Completa (IA)"}
              </button>
            )}

            {error && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {error}</div>}

            {aiReading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/25 flex flex-col gap-5 font-serif text-xs leading-relaxed"
              >
                <div className="text-[10px] text-amber-500/60 uppercase tracking-widest border-b border-amber-500/10 pb-2 flex items-center gap-2">🔮 Revelación del Oráculo</div>
                
                <div className="flex flex-col gap-3 mb-4">
                  {aiReading.cartas && Array.isArray(aiReading.cartas) && aiReading.cartas.map((c: any, i: number) => (
                    <div key={i} className="p-3 bg-zinc-950 rounded-xl border border-amber-500/10">
                      <div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-1">{c.posicion}: {c.carta}</div>
                      <p>{c.interpretacion}</p>
                    </div>
                  ))}
                </div>

                {aiReading.lectura_general && (
                  <div className="bg-amber-900/10 border border-amber-500/20 p-4 rounded-xl">
                    <h3 className="text-amber-400 font-bold text-[11px] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" /> Interpretación de la Tirada Completa
                    </h3>
                    <p className="text-amber-100/90 text-sm italic leading-relaxed">{aiReading.lectura_general}</p>
                  </div>
                )}

                {aiReading.mensaje_final && (
                  <div className="text-center italic text-amber-300 border-t border-amber-500/10 pt-4">
                    "{aiReading.mensaje_final}"
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
