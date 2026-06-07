/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  BookOpen,
  Film,
  Sparkles,
  Compass,
  Layers,
  Activity,
  ChevronRight,
  ChevronDown,
  Info,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  BookMarked,
  Award,
  Hash,
  Eye,
  Pyramid,
  Waves,
  Shuffle
} from "lucide-react";
import { SYMBOLS_DATABASE, CATEGORIES, EsotericSymbol } from "./symbolsData";

// Pure Web Audio Synth for meditative sound tuning during breathing and action triggers
class CelestialSynth {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
  }

  // Play a mystical, deeply resonant celestial bell chime
  playChime(freq: number = 294, duration: number = 2.0, type: "sine" | "triangle" = "sine") {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Harmonics for rich brassy bell tone
      if (type === "sine") {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.1);
        osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.5);
      }

      gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API blocked by security or unsupported in state", e);
    }
  }

  // Meditative oscillating background hum matching inhalation/exhalation
  createHumer(freq: number = 136.1) { // 136.1 Hz is Om/Cosmic frequency
    if (this.isMuted) return null;
    try {
      this.initCtx();
      if (!this.ctx) return null;

      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0.02, this.ctx.currentTime);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();

      return {
        stop: () => {
          try {
            osc.stop();
          } catch (e) {}
        },
        modulate: (ramp: number, duration: number) => {
          if (!this.ctx) return;
          gainNode.gain.linearRampToValueAtTime(ramp, this.ctx.currentTime + duration);
        }
      };
    } catch (e) {
      return null;
    }
  }
}

const synthInstance = new CelestialSynth();

export default function App() {
  const [activeTab, setActiveTab] = useState<"library" | "oracle" | "cinema" | "pathworking">("library");

  // General App states
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Mute control
  useEffect(() => {
    synthInstance.setMute(isAudioMuted);
  }, [isAudioMuted]);

  // Tab change chime
  const handleTabChange = (tab: "library" | "oracle" | "cinema" | "pathworking") => {
    setActiveTab(tab);
    if (tab === "library") synthInstance.playChime(220, 1.2, "sine"); // A3
    if (tab === "oracle") synthInstance.playChime(294, 1.2, "sine"); // D4
    if (tab === "cinema") synthInstance.playChime(349, 1.2, "sine"); // F4
    if (tab === "pathworking") synthInstance.playChime(440, 1.5, "triangle"); // A4
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-amber-50 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Mystical Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,80,24,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <header className="border-b border-amber-500/10 pb-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg border border-amber-500/30 flex items-center justify-center bg-zinc-900 shadow-md shadow-amber-500/10">
              <Pyramid className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-amber-500 uppercase font-serif">
                Decodificador Hermético
              </h1>
              <p className="text-xs text-amber-100/60 mt-0.5">
                Cábala • Tarot • Alquimia • Chakras • Qlifot • Pathworkings IA
              </p>
            </div>
          </div>

          {/* Sound & API Info Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="px-3 py-2 rounded-md border border-amber-500/20 bg-zinc-900/50 hover:bg-zinc-900 text-amber-100/80 transition-all flex items-center gap-2 text-xs"
              title={isAudioMuted ? "Activar audio ritual" : "Silenciar audio ritual"}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-zinc-400" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
              <span>{isAudioMuted ? "Mutado" : "Audio Activo"}</span>
            </button>
            <div className="px-3 py-2 rounded-md border border-amber-500/10 bg-zinc-900/30 text-[10px] text-amber-200/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Conexión Cósmica IA Lista</span>
            </div>
          </div>
        </header>

        {/* Traditional Temple-style Tabs */}
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-zinc-900/30 p-1 rounded-xl border border-amber-500/5 shadow-inner">
          <button
            onClick={() => handleTabChange("library")}
            className={`py-3 px-4 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 ${
              activeTab === "library"
                ? "bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 shadow-sm"
                : "text-zinc-400 hover:text-amber-100/90 hover:bg-zinc-900/40"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca</span>
          </button>

          <button
            onClick={() => handleTabChange("oracle")}
            className={`py-3 px-4 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 ${
              activeTab === "oracle"
                ? "bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 shadow-sm"
                : "text-zinc-400 hover:text-amber-100/90 hover:bg-zinc-900/40"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Oráculo de IA</span>
          </button>

          <button
            onClick={() => handleTabChange("cinema")}
            className={`py-3 px-4 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 ${
              activeTab === "cinema"
                ? "bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 shadow-sm"
                : "text-zinc-400 hover:text-amber-100/90 hover:bg-zinc-900/40"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Cine Iniciático</span>
          </button>

          <button
            onClick={() => handleTabChange("pathworking")}
            className={`py-3 px-4 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 ${
              activeTab === "pathworking"
                ? "bg-gradient-to-b from-amber-500/20 to-amber-500/5 border border-amber-500/30 text-amber-400 shadow-sm"
                : "text-zinc-400 hover:text-amber-100/90 hover:bg-zinc-900/40"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Viaje Astral</span>
          </button>
        </nav>

        {/* Inner Content Area */}
        <main className="flex-grow flex flex-col">
          <AnimatePresence mode="wait">
            {activeTab === "library" && <LibraryView />}
            {activeTab === "oracle" && <OracleView />}
            {activeTab === "cinema" && <CinemaView />}
            {activeTab === "pathworking" && <PathworkingView />}
          </AnimatePresence>
        </main>

        {/* Footer with Gnostic Quotes */}
        <footer className="mt-16 pt-6 border-t border-amber-500/10 text-center pb-6">
          <p className="text-[11px] text-amber-100/40 font-serif italic max-w-2xl mx-auto">
            &ldquo;Como es arriba, es abajo; como es abajo, es arriba, para realizar los milagros del Único Algo.&rdquo;
            <span className="block not-italic text-[10px] mt-1 text-amber-500/40 uppercase tracking-widest">— El Kybalion • Hermes Trismegisto</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

// ==========================================
// 1. BIBLIOTECA VIEW (Symbol Dictionary)
// ==========================================
function LibraryView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSymbol, setActiveSymbol] = useState<EsotericSymbol | null>(SYMBOLS_DATABASE[0]);
  const [depth, setDepth] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  // AI amplification trigger for the selected card
  const [aiContext, setAiContext] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  const handleAmplificaIA = async (symbolName: string) => {
    setAiLoading(true);
    setErrorStr("");
    setAiResult(null);
    synthInstance.playChime(370, 1.5, "triangle"); // F#4
    try {
      const resp = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: symbolName,
          context: aiContext || "Dame un análisis avanzado con claves astrológicas correspondientes."
        })
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || "Falla en transmutación estelar.");
      }
      const data = await resp.json();
      setAiResult(data);
      synthInstance.playChime(523.25, 2.0, "sine"); // C5 (High chime on success)
    } catch (e: any) {
      console.error(e);
      setErrorStr(e.message || "Error al conectar con la sabiduría celestial de la IA.");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredSymbols = SYMBOLS_DATABASE.filter((sym) => {
    const matchesCat = selectedCategory === "all" || sym.category === selectedCategory;
    const matchesSearch = sym.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sym.association.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      {/* Sidebar: Categories & Lists */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Filtrar símbolos, claves..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-amber-500/20 rounded-lg py-2.5 pl-10 pr-4 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Dropdown / Accordion */}
        <div className="relative z-20">
          <button
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-all shadow-md shadow-amber-500/5"
          >
            <div className="flex items-center gap-2">
              <span>{selectedCategory === "all" ? "🌌" : CATEGORIES.find(c => c.id === selectedCategory)?.emoji}</span>
              <span>{selectedCategory === "all" ? "Todas las Categorías" : CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isCategoryMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-950 border border-amber-500/30 rounded-lg shadow-xl shadow-black/50 flex flex-col max-h-64 overflow-y-auto overflow-x-hidden z-30"
              >
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsCategoryMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 text-left text-xs transition-all flex items-center gap-2 ${
                    selectedCategory === "all"
                      ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-500"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-amber-200 border-l-2 border-transparent"
                  }`}
                >
                  <span>🌌</span>
                  <span>Todas las Categorías</span>
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsCategoryMenuOpen(false);
                      // Select first in list automatically if found
                      const firstOpt = SYMBOLS_DATABASE.find(s => s.category === cat.id);
                      if (firstOpt) {
                        setActiveSymbol(firstOpt);
                        setAiResult(null);
                      }
                    }}
                    className={`px-4 py-2.5 text-left text-xs transition-all flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-500"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-amber-200 border-l-2 border-transparent"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Symbols List */}
        <div className="bg-zinc-900/40 rounded-xl border border-amber-500/10 max-h-[460px] overflow-y-auto p-2 flex flex-col gap-1">
          <div className="text-[10px] text-amber-100/40 uppercase tracking-widest px-2- py-1 mb-1 border-b border-zinc-800/50 pb-1.5 flex justify-between">
            <span>Símbolos Disponibles ({filteredSymbols.length})</span>
            <span className="text-amber-500/40">7 Categorías</span>
          </div>

          {filteredSymbols.map((sym) => (
            <button
              key={sym.id}
              onClick={() => {
                setActiveSymbol(sym);
                setAiResult(null); // Reset IA amplification results
                synthInstance.playChime(330, 0.4, "sine"); // E4 short accent
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                activeSymbol?.id === sym.id
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-200"
                  : "bg-zinc-950/20 border border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-amber-100/90"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{sym.emoji}</span>
                <div>
                  <div className="text-xs font-semibold">{sym.name}</div>
                  <div className="text-[10px] opacity-60 text-amber-100/60 truncate max-w-[190px]">{sym.association}</div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeSymbol?.id === sym.id ? "rotate-90 text-amber-400" : ""}`} />
            </button>
          ))}

          {filteredSymbols.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Ningún símbolo coincide con este filtro terrenal.
            </div>
          )}
        </div>
      </div>

      {/* Main Display panel of selected symbol */}
      <div className="lg:col-span-8">
        {activeSymbol ? (
          <div className="flex flex-col gap-6">
            
            {/* The main visual archetype card */}
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/25 shadow-xl flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />
              
              {/* Card Header */}
              <div className="flex justify-between items-start border-b border-amber-500/10 pb-4">
                <div className="flex gap-4 items-center">
                  <div className="text-4xl bg-zinc-900 border border-amber-500/20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/5">
                    {activeSymbol.emoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-serif text-amber-400 flex items-center gap-2">
                      {activeSymbol.name}
                      {activeSymbol.gematria && (
                        <span className="text-xs text-amber-200/50 font-sans tracking-wide">
                          ({activeSymbol.gematria})
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-amber-100/60">{activeSymbol.association}</p>
                    <p className="text-[10px] mt-1 uppercase text-amber-500/50 tracking-widest bg-amber-500/5 px-2 py-0.5 rounded inline-block">
                      {CATEGORIES.find(c => c.id === activeSymbol.category)?.name}
                    </p>
                  </div>
                </div>

                {/* Depth tabs */}
                <div className="flex flex-wrap gap-1 bg-zinc-950 p-1 rounded-xl border border-amber-500/15 shadow-inner">
                  {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      id={`btn-depth-${lvl}`}
                      onClick={() => {
                        setDepth(lvl);
                        synthInstance.playChime(lvl === "beginner" ? 220 : lvl === "intermediate" ? 330 : 440, 0.7);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider uppercase transition-all border ${
                        depth === lvl
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm"
                          : "text-zinc-400 border-transparent hover:text-amber-100 hover:bg-zinc-900/50"
                      }`}
                    >
                      <span className="text-xs">
                        {lvl === "beginner" ? "🌱" : lvl === "intermediate" ? "🌿" : "🌳"}
                      </span>
                      <span className="hidden sm:inline-block">
                        {lvl === "beginner" ? "Principiante" : lvl === "intermediate" ? "Intermedio" : "Avanzado"}
                      </span>
                      <span className="sm:hidden text-[9px]">
                        {lvl === "beginner" ? "Princ." : lvl === "intermediate" ? "Inter." : "Avanz."}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Body - Content text with medieval aesthetic layout */}
              <div className="flex flex-col gap-4 text-xs leading-relaxed text-amber-100/90 font-serif min-h-[140px] p-4 bg-zinc-900/30 rounded-xl relative border border-amber-500/5">
                <div className="absolute top-3 right-3 text-[10px] text-amber-500/40 uppercase tracking-widest select-none flex items-center gap-1.5">
                  <BookMarked className="w-3.5 h-3.5" />
                  <span>
                    Nivel {depth === "beginner" ? "Principiante" : depth === "intermediate" ? "Intermedio" : "Avanzado"}
                  </span>
                </div>

                {depth === "beginner" && (
                  <div className="space-y-3">
                    <p className="text-sm font-sans italic text-amber-100/70 border-l border-amber-500/30 pl-3">
                      Acceso básico representativo para neófitos.
                    </p>
                    <p className="text-justify font-sans">{activeSymbol.beginner}</p>
                  </div>
                )} {depth === "intermediate" && (
                  <div className="space-y-3">
                    <p className="text-sm font-sans italic text-amber-100/70 border-l border-amber-500/30 pl-3">
                      Correspondencias en Cábala, Tarot, Alquimia y Hermetismo.
                    </p>
                    <p className="text-justify font-sans">{activeSymbol.intermediate}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-amber-500/5 text-[11px] text-amber-500/60 font-sans">
                      <div>🗝️ Sistema: Conexiones del Macrocosmos</div>
                      <div>⚖️ Principio: Correspondencia Cósmica</div>
                    </div>
                  </div>
                )} {depth === "advanced" && (
                  <div className="space-y-4">
                    <p className="text-sm font-sans italic text-amber-100/70 border-l border-amber-500/30 pl-3">
                      Teúrgia ceremonial, Grimorias antiguas y ritual operativo real.
                    </p>
                    <p className="text-justify font-sans">{activeSymbol.advanced}</p>
                    <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg text-[11px] text-amber-200 font-sans">
                      <strong className="text-amber-500 uppercase tracking-wider block mb-1 text-xs">⚠️ ADVERTENCIA INICIÁTICA:</strong>
                      Las prácticas ceremoniales teúrgicas requieren quietud mental absoluta, pulcritud moral y círculos de protección astral consagrados.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Amplification Interface */}
            <div className="bg-zinc-900/50 p-5 rounded-xl border border-amber-500/10 flex flex-col gap-4 shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Amplificación Hermética de Gnosis (Aritmetismo Artificial)
                </h3>
              </div>

              <p className="text-[11px] text-amber-100/60">
                Usa la inteligencia artificial para fusionar a <strong>{activeSymbol.name}</strong> con tu propósito introspectivo. Elabora una pregunta para que el oráculo te revele correspondencias únicas.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ej: ¿Cómo se expresa en la meditación del Pilar Medio? o ¿Cuál es su arcá de tarot?"
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  disabled={aiLoading}
                  className="flex-grow bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-3 text-xs placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-amber-100"
                />
                <button
                  onClick={() => handleAmplificaIA(activeSymbol.name)}
                  disabled={aiLoading}
                  className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {aiLoading ? "Invocando..." : "Amplificar con IA"}
                  {aiLoading ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-ping" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-zinc-950" />
                  )}
                </button>
              </div>

              {/* Error handle */}
              {errorStr && (
                <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">
                  ❌ {errorStr}
                </div>
              )}

              {/* Show AI Amplification result */}
              {aiLoading && (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-amber-500 border-t-transparent animate-spin" />
                  <p className="text-xs italic text-amber-400/80 uppercase tracking-widest animate-pulse">
                    Moviendo esferas astrales a través de Gemini...
                  </p>
                </div>
              )}

              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-amber-500/20 rounded-xl bg-zinc-950 p-5 flex flex-col gap-4 font-serif text-xs leading-relaxed"
                >
                  <div className="flex items-center gap-2 justify-between border-b border-amber-500/10 pb-2">
                    <span className="text-[10px] text-amber-500/60 uppercase tracking-widest font-sans">
                      REVELACIÓN DIVINA OBTENIDA
                    </span>
                    <span className="text-[9px] text-zinc-500 block font-mono">
                      Formato: JSON Hermético Parseado
                    </span>
                  </div>

                  {aiResult.etimologia && (
                    <div>
                      <span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">
                        ⚜️ Etimología y Origen
                      </span>
                      <p className="text-justify">{aiResult.etimologia}</p>
                    </div>
                  )}

                  {aiResult.hermetismo && (
                    <div>
                      <span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">
                        🪐 Principios Herméticos
                      </span>
                      <p className="text-justify">{aiResult.hermetismo}</p>
                    </div>
                  )}

                  {aiResult.cabala && (
                    <div>
                      <span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">
                        🌳 Cábala y Sendero del Árbol
                      </span>
                      <p className="text-justify">{aiResult.cabala}</p>
                    </div>
                  )}

                  {aiResult.alquimia && (
                    <div>
                      <span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">
                        🧪 Alquimia y Transmutación
                      </span>
                      <p className="text-justify">{aiResult.alquimia}</p>
                    </div>
                  )}

                  {aiResult.tarot && (
                    <div>
                      <span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">
                        🃏 Correspondencias de Arquería
                      </span>
                      <p className="text-justify">{aiResult.tarot}</p>
                    </div>
                  )}

                  {aiResult.practica_mágica && (
                    <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                      <span className="text-amber-500 uppercase tracking-wider font-bold block text-[10px] font-sans mb-1 pb-1 border-b border-amber-500/10">
                        ⚡ Práctica Iniciática de Vigilia
                      </span>
                      <p className="text-justify text-amber-100/90">{aiResult.practica_mágica}</p>
                    </div>
                  )}

                  {aiResult.paradoja_esoterica && (
                    <div className="text-center italic text-amber-300 font-sans border-t border-amber-500/10 pt-4 mt-2">
                      &ldquo;{aiResult.paradoja_esoterica}&rdquo;
                      <span className="block text-[8px] text-amber-500/40 uppercase tracking-widest mt-1">
                        — Decreto de Trascendencia
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </div>
        ) : (
          <div className="h-full py-20 flex flex-col items-center justify-center border border-dashed border-amber-500/20 rounded-2xl bg-zinc-900/10">
            <Compass className="w-12 h-12 text-amber-500/20 mb-3 animate-spin duration-1000" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest">
              Selecciona un símbolo iniciático del relicario izquierdo
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ==========================================
// 2. ORÁCULO DE IA VIEW (Esoteric Decoder)
// ==========================================
function OracleView() {
  const [term, setTerm] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;

    setLoading(true);
    setErrorStr("");
    setResult(null);
    synthInstance.playChime(370, 2.0, "triangle"); // Mystical tone

    try {
      const response = await fetch("/api/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term, context })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "La sabiduría celeste se opone actualmente.");
      }
      const data = await response.json();
      setResult(data);
      synthInstance.playChime(523.25, 2.0, "sine"); // High success bell C5
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Error al conectar con la invocación de decodificación.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetTerm: string, presetCtx: string) => {
    setTerm(presetTerm);
    setContext(presetCtx);
    synthInstance.playChime(330, 0.4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      {/* Intro Form */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">
              Oráculo de Decodificación Integral
            </h2>
            <p className="text-xs text-amber-100/60">
              Evoca a la Gnosis. Entra cualquier término esotérico, concepto, sueño o símbolo planetario para su análisis teúrgico.
            </p>
          </div>
        </div>

        {/* Suggestion presets */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-amber-500/60 uppercase tracking-widest mr-1">Términos sugeridos:</span>
          <button
            onClick={() => handlePreset("La Piedra Filosofal", "¿Cómo se relaciona con la etapa rubedo de transmutación espiritual?")}
            className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 hover:text-amber-200 border border-amber-500/10 transition-all"
          >
            🧪 Piedra Filosofal
          </button>
          <button
            onClick={() => handlePreset("Abraxas", "Simbología gnóstica y numismática del Basílides.")}
            className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 hover:text-amber-200 border border-amber-500/10 transition-all"
          >
            🛡️ Abraxas
          </button>
          <button
            onClick={() => handlePreset("Tetractys", "La década de Pitágoras, gnosticismo matemático primoridal.")}
            className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 hover:text-amber-200 border border-amber-500/10 transition-all"
          >
            📐 Tetractys
          </button>
          <button
            onClick={() => handlePreset("El Santo Grial", "Interpretación de la copa hermética y herencia cátara.")}
            className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 hover:text-amber-200 border border-amber-500/10 transition-all"
          >
            🏆 Santo Grial
          </button>
        </div>

        <form onSubmit={handleDecode} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Símbolo o Término Celestial:
              </label>
              <input
                type="text"
                required
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Ej: Sigilo de Rafael, El Ojo de Horus, Ain Soph Aur..."
                className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Contexto / Marco Introspectivo (Opcional):
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Ej: ¿Tiene conexiones con el sendero astral de la luna?"
                className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 active:bg-amber-700 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2"
          >
            {loading ? "Emanando Sabiduría de las Fuerzas..." : "Invocar Sabiduría del Oráculo"}
            {loading ? (
              <span className="w-2 h-2 rounded-full bg-zinc-400 animate-ping" />
            ) : (
              <Sparkles className="w-4 h-4 text-zinc-950" />
            )}
          </button>
        </form>

        {errorStr && (
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">
            ❌ {errorStr}
          </div>
        )}
      </div>

      {/* Loading Ritual Animation */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/10 rounded-2xl border border-amber-500/5">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border border-purple-500/20 border-b-purple-500 animate-spin duration-1000" />
            <div className="absolute inset-4 rounded-full border border-dashed border-amber-200/10 animate-pulse" />
          </div>
          <p className="text-xs italic text-amber-400 animate-pulse text-center max-w-sm">
            Interpretando gematría antigua, principios del hermetismo y correspondencias teúrgicas de las esferas...
          </p>
        </div>
      )}

      {/* Result Presentation */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 shadow-2xl flex flex-col gap-6 relative"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-2 left-2 text-[10px] text-amber-500/20 select-none">🜁</div>
          <div className="absolute top-2 right-2 text-[10px] text-amber-500/20 select-none">🜂</div>
          <div className="absolute bottom-2 left-2 text-[10px] text-amber-500/20 select-none">🜃</div>
          <div className="absolute bottom-2 right-2 text-[10px] text-amber-500/20 select-none">🜄</div>

          <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center text-xs">
            <h3 className="text-sm font-bold font-serif text-amber-400 uppercase tracking-widest">
              ⚜️ Pergamino Decodificado: {term}
            </h3>
            <span className="text-[10px] text-amber-200/60 font-mono">Resonancia Gemini 3.5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-xs text-amber-100 font-serif">
            
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {result.etimologia && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-1.5 shadow-inner">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-amber-500/60" /> Etimología y Origen
                  </h4>
                  <p className="text-justify">{result.etimologia}</p>
                </div>
              )}

              {result.cabala && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-1.5 shadow-inner">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-amber-500/60" /> Correspondencia Cabalística
                  </h4>
                  <p className="text-justify">{result.cabala}</p>
                </div>
              )}

              {result.tarot && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-1.5 shadow-inner">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-500/60" /> Símbolos del Tarot Clave
                  </h4>
                  <p className="text-justify">{result.tarot}</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {result.hermetismo && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-1.5 shadow-inner">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-500/60" /> Principios de Filosofía Hermética
                  </h4>
                  <p className="text-justify">{result.hermetismo}</p>
                </div>
              )}

              {result.alquimia && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-1.5 shadow-inner">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Pyramid className="w-3.5 h-3.5 text-amber-500/60" /> Alquimia Operativa y de Fluidos
                  </h4>
                  <p className="text-justify">{result.alquimia}</p>
                </div>
              )}

              {result.practica_mágica && (
                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/15 flex flex-col gap-1.5 shadow-inner">
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-500/80 animate-spin duration-3000" /> Práctica Teúrgica Consagrada
                  </h4>
                  <p className="text-justify text-amber-100/90">{result.practica_mágica}</p>
                </div>
              )}
            </div>
          </div>

          {result.paradoja_esoterica && (
            <div className="mt-4 p-4 border border-zinc-800 rounded-xl bg-zinc-950/50 text-center flex flex-col items-center gap-1">
              <span className="text-[9px] uppercase tracking-widest text-amber-500/40 font-mono">Gnosis en Enigma</span>
              <p className="italic text-amber-350 text-sm max-w-2xl font-sans leading-relaxed">
                &ldquo;{result.paradoja_esoterica}&ldquo;
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// ==========================================
// 3. CINE INICIÁTICO VIEW (Movie Analysis)
// ==========================================
function CinemaView() {
  const [movieName, setMovieName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieName.trim()) return;

    setLoading(true);
    setErrorStr("");
    setResult(null);
    synthInstance.playChime(261.63, 1.8, "sine"); // Meditative cinematic tone (C4)

    try {
      const response = await fetch("/api/analyze-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie: movieName })
      });
      if (!response.ok) {
        const errVal = await response.json();
        throw new Error(errVal.error || "Las musas del teatro oscurecieron los carretes.");
      }
      const data = await response.json();
      setResult(data);
      synthInstance.playChime(392, 1.5, "triangle"); // success tone (G4)
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Error al solicitar el análisis hermético cinematográfico.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (name: string) => {
    setMovieName(name);
    synthInstance.playChime(330, 0.4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <Film className="w-6 h-6 text-amber-400 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">
              Cine Gnóstico e Iniciático
            </h2>
            <p className="text-xs text-amber-100/60">
              Analiza películas populares bajo la óptica de la Cábala, Gnosticismo profundo, Alquimia operativa y el camino áureo de trascendencia.
            </p>
          </div>
        </div>

        {/* Cinematic Presets */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-amber-500/60 uppercase tracking-widest mr-1">Obras Clásicas:</span>
          {["The Matrix", "El Show de Truman", "Interstellar", "Inception", "El Laberinto del Fauno"].map((f) => (
            <button
              key={f}
              onClick={() => handleSelectPreset(f)}
              className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 hover:text-amber-200 border border-amber-500/10 transition-all"
            >
              🎥 {f}
            </button>
          ))}
        </div>

        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            required
            value={movieName}
            onChange={(e) => setMovieName(e.target.value)}
            placeholder="Introduce el título de una película o serie de misterio..."
            className="flex-grow bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {loading ? "Analizando..." : "Analizar Gnosis del Film"}
            {loading ? (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-ping" />
            ) : (
              <Film className="w-4 h-4 text-zinc-950" />
            )}
          </button>
        </form>

        {errorStr && (
          <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">
            ❌ {errorStr}
          </div>
        )}
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-zinc-900/10 rounded-2xl border border-amber-500/5">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-xs italic text-amber-400 animate-pulse text-center max-w-sm">
            Escrutando revelaciones gnósticas e identificando arquetipos ocultos tras las cortinas de la pantalla terrenal...
          </p>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 shadow-2xl flex flex-col gap-6"
        >
          <div className="border-b border-amber-500/10 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <span className="text-[10px] text-amber-500 uppercase tracking-widest font-mono">REVELACIONES HISTÓRICAS CELESTIALES:</span>
              <h3 className="text-base font-bold font-serif text-amber-400 uppercase mt-0.5">
                🎬 Decodificación Obra: {movieName}
              </h3>
            </div>
            <span className="text-[9px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 inline-block font-mono max-w-max">
              Gnosis Certificada por IA
            </span>
          </div>

          <div className="flex flex-col gap-6 text-xs text-amber-100 font-serif leading-relaxed">
            
            {/* Gnostic plot */}
            {result.sinopsis_esoterica && (
              <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-2 shadow-inner">
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500/60" /> Sinopsis Gnóstica Primordial (El Gran Escape)
                </h4>
                <p className="text-justify font-sans text-amber-100/80 leading-relaxed italic border-l-2 border-amber-500/30 pl-3">
                  {result.sinopsis_esoterica}
                </p>
              </div>
            )}

            {/* Character Archetypes */}
            {result.arquetipos && result.arquetipos.length > 0 && (
              <div>
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500/60" /> Arquetipos Iniciáticos de Reparto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {result.arquetipos.map((arq: any, idx: number) => (
                    <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-amber-500/5 flex flex-col gap-1 shadow">
                      <span className="font-bold text-amber-350 text-[11px] font-sans">{arq.personaje || "Buscador"}</span>
                      <span className="text-[10px] text-amber-500 font-semibold">{arq.arquetipo || "El Camino"}</span>
                      <p className="text-[10px] text-amber-100/60 font-sans leading-tight mt-1">{arq.significado || arq.descripcion || ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Signs symbols */}
            {result.simbolos_ocultos && result.simbolos_ocultos.length > 0 && (
              <div>
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-amber-500/60" /> Señales Ocultas y Pistas de Escenario
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.simbolos_ocultos.map((sim: any, idx: number) => (
                    <div key={idx} className="p-3 bg-zinc-950 rounded-lg border border-amber-500/5 flex gap-3 items-start shadow">
                      <span className="text-xl p-1 bg-amber-500/5 rounded border border-amber-500/10">👁️</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-amber-250 text-[11px] font-sans">{sim.elemento || sim.simbolo || "Materia Oscura"}</span>
                        <p className="text-[10px] text-amber-100/60 font-sans leading-relaxed">{sim.decodificacion || sim.significado || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Three Stages of Alchemical Transmutation */}
            {result.fases_transmutacion && (
              <div className="p-5 bg-zinc-950 rounded-xl border border-amber-500/10 flex flex-col gap-4">
                <h4 className="text-[10px] font-sans font-bold uppercase tracking-widest text-amber-400 border-b border-amber-500/10 pb-2 flex items-center gap-1.5">
                  <Pyramid className="w-3.5 h-3.5 text-amber-500/60" /> Las Tres Etapas del Ouroboros Alquímico Espiritual
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Nigredo */}
                  <div className="p-3 bg-zinc-950/80 rounded-lg border-l-2 border-zinc-500 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3),transparent)] flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-zinc-300 text-xs uppercase font-sans">🖤 Nigredo</span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest">Caos / Muerte</span>
                    </div>
                    <p className="text-[10px] text-amber-100/70 font-sans leading-relaxed mt-1.5">
                      {result.fases_transmutacion.nigredo || result.fases_transmutacion.fase_1 || "Disolución existencial inicial, ruptura del velo de ilusión ordinaria."}
                    </p>
                  </div>

                  {/* Albedo */}
                  <div className="p-3 bg-zinc-950/80 rounded-lg border-l-2 border-amber-200/50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)] flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-amber-100 text-xs uppercase font-sans">🤍 Albedo</span>
                      <span className="text-[9px] text-amber-200/50 uppercase tracking-widest">Luz / Lavado</span>
                    </div>
                    <p className="text-[10px] text-amber-100/70 font-sans leading-relaxed mt-1.5">
                      {result.fases_transmutacion.albedo || result.fases_transmutacion.fase_2 || "Conciencia clara, unificación mental de polaridades, curación profunda."}
                    </p>
                  </div>

                  {/* Rubedo */}
                  <div className="p-3 bg-zinc-950/80 rounded-lg border-l-2 border-red-500 bg-[linear-gradient(to_bottom,rgba(239,68,68,0.05),transparent)] flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-red-400 text-xs uppercase font-sans">❤️ Rubedo</span>
                      <span className="text-[9px] text-red-500/60 uppercase tracking-widest">Elixir / Oro</span>
                    </div>
                    <p className="text-[10px] text-amber-100/70 font-sans leading-relaxed mt-1.5">
                      {result.fases_transmutacion.rubedo || result.fases_transmutacion.fase_3 || "Integración final soberana, consecución exitosa de la Gran Obra de espíritu."}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* Gnostic Decree conclusion */}
            {result.conclusion_gnostica && (
              <div className="mt-2 text-center border-t border-amber-500/10 pt-4 px-2">
                <span className="text-[8px] uppercase tracking-widest text-amber-500/40 font-mono block mb-1">El Despertar Supremo del Carrete</span>
                <p className="italic text-amber-300 font-sans text-sm max-w-2xl mx-auto leading-relaxed">
                  &ldquo;{result.conclusion_gnostica}&rdquo;
                </p>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ==========================================
// 4. VIAJE ASTRAL VIEW (Pathworkings & Breath)
// ==========================================
function PathworkingView() {
  const [focusType, setFocusType] = useState<"tarot" | "sefira" | "zodiaco" | "custom">("tarot");
  const [focusPreset, setFocusPreset] = useState("V - El Hierofante");
  const [customFocus, setCustomFocus] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  // Pranayama Breathing Companion States
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "holdIn" | "exhale" | "holdOut">("inhale");
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [breathCount, setBreathCount] = useState(0);

  // Audio oscillation modulator holding ref
  const hummerRef = useRef<any>(null);

  // Clean hummer on unmount
  useEffect(() => {
    return () => {
      if (hummerRef.current) {
        hummerRef.current.stop();
      }
    };
  }, []);

  // Preset dictionary mapping based on selected focusType
  const focusPresets = {
    tarot: [
      "0 - El Loco",
      "I - El Mago",
      "II - La Sacerdotisa",
      "X - Rueda de la Fortuna",
      "XIII - La Muerte",
      "XXI - El Mundo"
    ],
    sefira: [
      "Sendero de Tav: Malkuth hacia Yesod",
      "Sefirá de Yesod",
      "Sendero de Resh: Yesod a Hod",
      "Sefirá de Tiphereth",
      "Cruce del Abismo celestial"
    ],
    zodiaco: [
      "Constelación de Orión",
      "Fuerza Estelar de Aries",
      "Mar cósmico de Piscis",
      "Invocación de las Pléyades"
    ]
  } as any;

  // React on focusType change by swapping presets
  useEffect(() => {
    if (focusType !== "custom" && focusPresets[focusType]) {
      setFocusPreset(focusPresets[focusType][0]);
    }
  }, [focusType]);

  // Breathing Loop Scheduler (Sama Vritti 4-4-4-4 Pranayama)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isBreathingActive) {
      // Lazy start a hummer frequency
      if (!hummerRef.current) {
        hummerRef.current = synthInstance.createHumer();
      }

      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            let nextPhase: typeof breathPhase = "inhale";
            
            if (breathPhase === "inhale") {
              nextPhase = "holdIn";
              synthInstance.playChime(392, 0.8, "sine"); // Tone G4 for Hold
              if (hummerRef.current) hummerRef.current.modulate(0.04, 0.1);
            } else if (breathPhase === "holdIn") {
              nextPhase = "exhale";
              synthInstance.playChime(294, 0.8, "sine"); // Tone D4 for Exhale
              if (hummerRef.current) hummerRef.current.modulate(0.005, 1.5);
            } else if (breathPhase === "holdIn") {
              nextPhase = "exhale";
            } else if (breathPhase === "exhale") {
              nextPhase = "holdOut";
              synthInstance.playChime(220, 0.8, "sine"); // Tone A3 for Hold out
              if (hummerRef.current) hummerRef.current.modulate(0.005, 0.1);
            } else if (breathPhase === "holdOut") {
              nextPhase = "inhale";
              synthInstance.playChime(330, 0.8, "sine"); // Tone E4 for Inhale cycle start
              if (hummerRef.current) hummerRef.current.modulate(0.04, 1.5);
              setBreathCount((c) => c + 1);
            }

            setBreathPhase(nextPhase);
            return 4; // Reset to 4 seconds standard
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Disarm audio hummer
      if (hummerRef.current) {
        hummerRef.current.stop();
        hummerRef.current = null;
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive, breathPhase]);

  // Request astral pathworking generation
  const handleGeneratePathworking = async () => {
    const finalTitle = focusType === "custom" ? customFocus : focusPreset;
    if (!finalTitle.trim()) return;

    setLoading(true);
    setErrorStr("");
    setResult(null);
    synthInstance.playChime(370, 2.0, "triangle"); // Mystical chime (F#4)

    try {
      const resp = await fetch("/api/generate-pathworking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: finalTitle,
          focusType: focusType
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || "Los centinelas astrales rechazaron tu firma de luz.");
      }

      const data = await resp.json();
      setResult(data);
      synthInstance.playChime(523.25, 2.5, "sine"); // High success chime (C5)
    } catch (e: any) {
      console.error(e);
      setErrorStr(e.message || "Error al forjar tu sendera astral guiada.");
    } finally {
      setLoading(false);
    }
  };

  const toggleBreathing = () => {
    setIsBreathingActive(!isBreathingActive);
    synthInstance.playChime(349, 1.0, "sine"); // F4 trigger chord
  };

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase("inhale");
    setSecondsLeft(4);
    setBreathCount(0);
    synthInstance.playChime(220, 1.5, "sine"); // A3 disarm chord
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
    >
      {/* Left Column: Settings and breathing */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Forger controls */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3">
            <Compass className="w-5 h-5 text-amber-500 animate-spin duration-3000" />
            <h3 className="text-sm font-bold font-serif text-amber-400">
              Forjador Senda Astral (Pathworking)
            </h3>
          </div>

          <p className="text-[11px] text-amber-100/60 leading-relaxed">
            Un Pathworking es un viaje imaginario activo consagrado a través de los reinos invisibles del Árbol de la Vida o constelaciones astrales. Selecciona tu foco sagrado.
          </p>

          <div className="flex flex-col gap-3 text-xs">
            {/* Focus selector types */}
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-950 rounded-lg border border-amber-500/10">
              {(["tarot", "sefira", "zodiaco", "custom"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFocusType(type);
                    synthInstance.playChime(220, 0.4);
                  }}
                  className={`py-1.5 rounded transition-all text-[10px] font-semibold tracking-wider uppercase ${
                    focusType === type
                      ? "bg-amber-500/15 text-amber-300 font-bold"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {type === "tarot" ? "🃏" : type === "sefira" ? "🌳" : type === "zodiaco" ? "✨" : "🗝️"}
                </button>
              ))}
            </div>

            {/* Presets or custom field */}
            {focusType !== "custom" ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-amber-500/60 uppercase tracking-widest font-mono">
                  Enfoque Consagrado:
                </label>
                <select
                  value={focusPreset}
                  onChange={(e) => setFocusPreset(e.target.value)}
                  className="w-full bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-3 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                >
                  {focusPresets[focusType]?.map((p: string) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-amber-500/60 uppercase tracking-widest font-mono">
                  Foco Astral Personalizado:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Templos solares de Orión, Arcano de la Templanza..."
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  className="w-full bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-3 text-xs text-amber-100 placeholder-zinc-650 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            <button
              onClick={handleGeneratePathworking}
              disabled={loading}
              className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? "Estructurando Senda Astral..." : "Forjar Sendero Astral"}
              {loading ? (
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" />
              ) : (
                <Compass className="w-4 h-4 text-zinc-950" />
              )}
            </button>
          </div>

          {errorStr && (
            <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">
              ❌ {errorStr}
            </div>
          )}
        </div>

        {/* Pranayama Breathing Ring Companion */}
        <div className="bg-zinc-900/40 p-5 rounded-2xl border border-amber-500/10 shadow-lg flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-2.5">
            <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Acompañante de Respiración Rítmica
              </h3>
              <p className="text-[10px] text-amber-100/50">
                Sama Vritti Pranayama: 4 segundos por fase para sintonía cerebral
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner relative overflow-hidden">
            
            {/* Pulsing Breathing Aura circle */}
            <div
              className={`absolute w-36 h-36 rounded-full bg-amber-500/5 filter blur-xl transition-transform duration-4000 pointer-events-none ${
                isBreathingActive && breathPhase === "inhale" ? "scale-150 bg-amber-500/10" : "scale-100"
              }`}
            />

            {/* Micro Indicator of phases */}
            <div className="z-10 text-center flex flex-col items-center gap-2">
              <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${
                breathPhase === "inhale" ? "text-amber-400" :
                breathPhase === "holdIn" ? "text-purple-400" :
                breathPhase === "exhale" ? "text-amber-500/80" : "text-zinc-500"
              }`}>
                {breathPhase === "inhale" && "🌬️ Inhala aire sutil"}
                {breathPhase === "holdIn" && "🧘 Retén con pulmón lleno"}
                {breathPhase === "exhale" && "💨 Exhala aire burdo"}
                {breathPhase === "holdOut" && "🛑 Retén sin aire"}
              </span>

              {/* Progress counter */}
              <div className="relative w-20 h-20 rounded-full border border-amber-500/10 flex items-center justify-center bg-zinc-900/80 shadow">
                
                {/* Visual ticking circles */}
                <span className="text-3xl font-serif font-bold text-amber-200">{secondsLeft}s</span>
                
                {/* Outer ring */}
                <div
                  className={`absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent transition-all duration-1000 ${
                    secondsLeft === 4 ? "rotate-0" :
                    secondsLeft === 3 ? "rotate-90" :
                    secondsLeft === 2 ? "rotate-180" : "rotate-270"
                  }`}
                />
              </div>

              <span className="text-[10px] text-zinc-500 font-mono">
                Ciclos de Vigilia completados: {breathCount}
              </span>
            </div>

            {/* Breathing Controls */}
            <div className="flex gap-2.5 mt-4 z-10">
              <button
                onClick={toggleBreathing}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-1 border ${
                  isBreathingActive
                    ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                    : "bg-amber-500 border-amber-400 text-zinc-950 hover:bg-amber-400 font-bold"
                }`}
              >
                {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isBreathingActive ? "Pausar" : "Girar ciclo"}</span>
              </button>

              <button
                onClick={resetBreathing}
                className="px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-zinc-900 hover:bg-zinc-800 text-amber-200 transition-all text-xs"
                title="Resetear contador de ciclos"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Right Column: Pathworking display results */}
      <div className="lg:col-span-7">
        
        {loading && (
          <div className="py-24 flex flex-col items-center justify-center gap-4 border border-amber-500/10 rounded-2xl bg-zinc-900/20">
            <Compass className="w-12 h-12 text-amber-500 animate-spin duration-3000 mb-2" />
            <p className="text-xs text-amber-400 font-mono tracking-widest uppercase animate-pulse">
              Forjando crónicas de cruce astral sagrado...
            </p>
            <p className="text-[10px] text-zinc-500 italic text-center max-w-xs leading-normal">
              Conectando con maestros invisibles del Ein Sof para forjar tu pergamino en la gran bóveda...
            </p>
          </div>
        )}

        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 p-6 rounded-2xl border border-amber-500/25 shadow-xl flex flex-col gap-6 relative"
          >
            {/* Background seal */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,80,24,0.02),transparent_70%)] pointer-events-none" />

            <div className="border-b border-amber-500/10 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-[9px] text-amber-500/60 uppercase tracking-widest font-mono">
                  Senda Astral Forjada Exitosamente
                </span>
                <h3 className="text-base font-bold font-serif text-amber-400 mt-0.5">
                  🔮 Viaje: {focusType === "custom" ? customFocus : focusPreset}
                </h3>
              </div>
              <span className="text-[9px] text-purple-400 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded font-mono block max-w-max">
                Portal Teúrgia IA
              </span>
            </div>

            {/* Scrollable medieval layout */}
            <div className="flex flex-col gap-5 text-xs text-amber-100 font-serif leading-relaxed max-h-[640px] overflow-y-auto pr-2 scrollbar-thin">
              
              {/* Preparations */}
              {result.preparacion && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                  <span className="text-amber-500 uppercase tracking-wider font-bold block text-[10px] mb-2 pb-1 border-b border-amber-500/5 font-sans">
                    🌱 Preparación del Vehículo Carnal
                  </span>
                  <p className="text-justify font-sans text-amber-100/80 italic">{result.preparacion}</p>
                </div>
              )}

              {/* Threshold portal */}
              {result.rumbo && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                  <span className="text-amber-500 uppercase tracking-wider font-bold block text-[10px] mb-2 pb-1 border-b border-amber-500/5 font-sans">
                    ⚙️ El Umbral Astral de Cruce (Sigilo Celestial)
                  </span>
                  <p className="text-justify font-sans text-amber-200/90 leading-relaxed font-semibold">{result.rumbo}</p>
                </div>
              )}

              {/* Narrative Journey */}
              {result.viaje_narrativo && (
                <div className="p-5 bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl border border-amber-500/20 text-justify font-serif text-[12px] leading-relaxed shadow-inner">
                  <span className="text-purple-400 uppercase tracking-widest font-bold block text-[10px] mb-3 border-b border-amber-500/10 pb-1 font-sans">
                    🌌 Proyección Consciente Guiada (Viaje Astral)
                  </span>
                  <div className="space-y-4 text-amber-100/90 whitespace-pre-line first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-2">
                    {result.viaje_narrativo}
                  </div>
                </div>
              )}

              {/* Commuinion */}
              {result.comunion_ritual && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                  <span className="text-amber-500 uppercase tracking-wider font-bold block text-[10px] mb-2 pb-1 border-b border-amber-500/5 font-sans">
                    👼 Comunión y Revelaciones del Regente de Senda
                  </span>
                  <p className="text-justify">{result.comunion_ritual}</p>
                </div>
              )}

              {/* Return procedure */}
              {result.retorno && (
                <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10">
                  <span className="text-amber-500 uppercase tracking-wider font-bold block text-[10px] mb-2 pb-1 border-b border-amber-500/5 font-sans">
                    🪵 El Retorno Armónico de tu Conciencia
                  </span>
                  <p className="text-justify font-sans text-amber-100/80 italic">{result.retorno}</p>
                </div>
              )}

              {/* Decree sealing mantra */}
              {result.mantra_afirmacion && (
                <div className="text-center p-4 border border-zinc-800 rounded-xl bg-zinc-950 mt-4 flex flex-col items-center gap-1.5 shadow-md">
                  <span className="text-[8px] uppercase tracking-widest text-amber-500/40 font-mono">Fórmula Sónica de Cierre</span>
                  <p className="font-bold text-amber-300 font-sans text-base tracking-wide uppercase">
                    &ldquo;{result.mantra_afirmacion}&rdquo;
                  </p>
                  <span className="text-[10px] text-zinc-500 font-serif italic">
                    Sella y ancla la vibración astral experimentada en tu cuerpo Malkuth.
                  </span>
                </div>
              )}

            </div>
          </motion.div>
        )}

        {!result && !loading && (
          <div className="h-full py-24 flex flex-col items-center justify-center border border-dashed border-amber-500/20 rounded-2xl bg-zinc-900/10">
            <Compass className="w-12 h-12 text-zinc-500/20 mb-3 animate-pulse" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest text-center max-w-xs">
              Configura tu sendero en el panel de forjado y haz clic en &quot;Forjar Sendero Astral&quot; para iniciar tu viaje astral guiado por IA
            </p>
          </div>
        )}

      </div>
    </motion.div>
  );
}
