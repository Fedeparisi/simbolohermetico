/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Hermético 2.0 — Full Phase 1 Implementation
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Film, Sparkles, Compass, Volume2, VolumeX,
  Pyramid, Hash, Star, Moon, Eye, Zap, ChevronLeft,
  ChevronRight, Menu, X, BarChart3, Shield, Brain
} from "lucide-react";
import { SYMBOLS_DATABASE, CATEGORIES, EsotericSymbol } from "./symbolsData";
import { synthInstance } from "./utils/synth";
import { safeFetchJSON } from "./utils/api";


const GematriaView = React.lazy(() => import("./components/GematriaView").then(m => ({ default: m.GematriaView })));
const SigilView = React.lazy(() => import("./components/SigilView").then(m => ({ default: m.SigilView })));
const TarotView = React.lazy(() => import("./components/TarotView").then(m => ({ default: m.TarotView })));
const LunarView = React.lazy(() => import("./components/LunarView").then(m => ({ default: m.LunarView })));
const DreamView = React.lazy(() => import("./components/DreamView").then(m => ({ default: m.DreamView })));
const CorrespondencesView = React.lazy(() => import("./components/CorrespondencesView").then(m => ({ default: m.CorrespondencesView })));
const AstrologyView = React.lazy(() => import("./components/AstrologyView").then(m => ({ default: m.AstrologyView })));
const MeditationView = React.lazy(() => import("./components/MeditationView").then(m => ({ default: m.MeditationView })));
const KundaliniView = React.lazy(() => import("./components/KundaliniView").then(m => ({ default: m.KundaliniView })));
const RitualsView = React.lazy(() => import("./components/RitualsView").then(m => ({ default: m.RitualsView })));
const VisualizationView = React.lazy(() => import("./components/VisualizationView").then(m => ({ default: m.VisualizationView })));
const MagicPathTest = React.lazy(() => import("./components/MagicPathTest").then(m => ({ default: m.MagicPathTest })));
const ArchetypeView = React.lazy(() => import("./components/ArchetypeView").then(m => ({ default: m.ArchetypeView })));
const Pathworking22View = React.lazy(() => import("./components/Pathworking22View").then(m => ({ default: m.Pathworking22View })));
const MapaGeneticoCompleto = React.lazy(() => import("./components/MapaGeneticoCompleto").then(m => ({ default: m.MapaGeneticoCompleto })));
const JournalView = React.lazy(() => import("./components/JournalView").then(m => ({ default: m.JournalView })));
import ThemeToggle from "./components/ThemeToggle";
import InstallPWA from "./components/InstallPWA";

// Import existing views inline (they stay in App.tsx for now — refactor optional)
import {
  Search, Layers, Activity, ChevronDown, Info, Play, Pause,
  RotateCcw, ArrowRight, BookMarked, Award, Hash as HashIcon,
  Waves, Shuffle
} from "lucide-react";

// ─── Navigation Configuration ─────────────────────────────────────────────
type ViewId =
  | "library" | "oracle" | "cinema" | "books" | "pathworking"
  | "gematria" | "sigil" | "tarot" | "lunar" | "dreams" | "correspondences" | "astrology" | "meditations" | "kundalini" | "rituals" | "visualization" | "magic_path" | "archetype" | "pathworking22" | "mapa_genetico" | "journal";

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ReactNode;
  category: string;
  emoji: string;
  isNew?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  // Estudio Hermético
  { id: "library", label: "Biblioteca", icon: <BookOpen className="w-4 h-4" />, category: "📚 Estudio Hermético", emoji: "📚" },
  { id: "oracle", label: "Oráculo IA", icon: <Sparkles className="w-4 h-4" />, category: "📚 Estudio Hermético", emoji: "🔮" },
  { id: "cinema", label: "Cine Gnóstico", icon: <Film className="w-4 h-4" />, category: "📚 Estudio Hermético", emoji: "🎬" },
  { id: "books", label: "Libros Iniciáticos", icon: <BookOpen className="w-4 h-4" />, category: "📚 Estudio Hermético", emoji: "📖" },
  // Herramientas Mágicas
  { id: "gematria", label: "Gematría", icon: <Hash className="w-4 h-4" />, category: "⚗️ Herramientas Mágicas", emoji: "✡️", isNew: true },
  { id: "sigil", label: "Sigilos", icon: <Star className="w-4 h-4" />, category: "⚗️ Herramientas Mágicas", emoji: "★", isNew: true },
  { id: "tarot", label: "Tarot", icon: <Layers className="w-4 h-4" />, category: "⚗️ Herramientas Mágicas", emoji: "🃏", isNew: true },
  { id: "correspondences", label: "Correspondencias", icon: <Zap className="w-4 h-4" />, category: "⚗️ Herramientas Mágicas", emoji: "⚡", isNew: true },
  // Práctica Espiritual
  { id: "pathworking", label: "Viaje Astral", icon: <Compass className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "🌌" },
  { id: "lunar", label: "Calendario Lunar", icon: <Moon className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "🌙", isNew: true },
  { id: "meditations", label: "Meditaciones", icon: <Waves className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "🧘", isNew: true },
  { id: "kundalini", label: "Kundalini", icon: <Activity className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "🌀", isNew: true },
  { id: "rituals", label: "Rituales", icon: <Shield className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "🛡️", isNew: true },
  { id: "visualization", label: "Visualización", icon: <Eye className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "💎", isNew: true },
  { id: "magic_path", label: "Test de Sendero", icon: <Compass className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "🔌", isNew: true },
  { id: "journal", label: "Diario", icon: <BookMarked className="w-4 h-4" />, category: "🧘 Práctica Espiritual", emoji: "📖", isNew: true },
  // Análisis Profundo
  { id: "dreams", label: "Análisis de Sueños", icon: <Eye className="w-4 h-4" />, category: "🔬 Análisis Profundo", emoji: "🔮", isNew: true },
  { id: "astrology", label: "Astrología", icon: <BarChart3 className="w-4 h-4" />, category: "🔬 Análisis Profundo", emoji: "📊", isNew: true },
  { id: "archetype", label: "Arquetipos", icon: <Brain className="w-4 h-4" />, category: "🔬 Análisis Profundo", emoji: "🎭", isNew: true },
  { id: "pathworking22", label: "Árbol de la Vida", icon: <Layers className="w-4 h-4" />, category: "🔬 Análisis Profundo", emoji: "🌳", isNew: true },
  { id: "mapa_genetico", label: "Mapa Genético", icon: <Star className="w-4 h-4" />, category: "🔬 Análisis Profundo", emoji: "📜", isNew: true },
];

const CATEGORIES_ORDER = ["📚 Estudio Hermético", "⚗️ Herramientas Mágicas", "🧘 Práctica Espiritual", "🔬 Análisis Profundo"];

// ─── Sidebar Component ────────────────────────────────────────────────────
function Sidebar({
  activeView,
  onNavigate,
  collapsed,
  onToggle,
  isMobile,
  mobileOpen,
  onMobileClose
}: {
  activeView: ViewId;
  onNavigate: (v: ViewId) => void;
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const handleNav = (id: ViewId) => {
    onNavigate(id);
    if (isMobile) onMobileClose();
    synthInstance.playChime(330, 0.5, "sine");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-amber-500/10 ${collapsed && !isMobile ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg border border-amber-500/30 flex items-center justify-center bg-zinc-900 shadow-md shadow-amber-500/10 shrink-0">
          <Pyramid className="w-4 h-4 text-amber-500 animate-pulse" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="overflow-hidden">
            <div className="text-xs font-bold tracking-widest text-amber-500 uppercase font-serif whitespace-nowrap">
              Decodificador
            </div>
            <div className="text-[9px] text-amber-100/40 uppercase tracking-wider whitespace-nowrap">
              Hermético 2.0
            </div>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="ml-auto p-1 rounded-md hover:bg-amber-500/10 text-amber-500/50 hover:text-amber-400 transition-all shrink-0"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="ml-auto p-1 text-zinc-400 hover:text-amber-400">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav items grouped by category */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-4">
        {CATEGORIES_ORDER.map(cat => {
          const items = NAV_ITEMS.filter(n => n.category === cat);
          return (
            <div key={cat}>
              {(!collapsed || isMobile) && (
                <div className="text-[9px] text-amber-500/40 uppercase tracking-widest px-2 mb-1.5 font-mono">{cat}</div>
              )}
              <div className="flex flex-col gap-0.5">
                {items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    title={collapsed && !isMobile ? item.label : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-xs font-semibold relative ${
                      activeView === item.id
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-300"
                        : "text-zinc-400 hover:text-amber-200 hover:bg-zinc-900/60 border border-transparent"
                    } ${collapsed && !isMobile ? "justify-center" : ""}`}
                  >
                    <span className={`shrink-0 ${activeView === item.id ? "text-amber-400" : ""}`}>
                      {collapsed && !isMobile ? (
                        <span className="text-base">{item.emoji}</span>
                      ) : item.icon}
                    </span>
                    {(!collapsed || isMobile) && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.isNew && (
                          <span className="ml-auto text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                            Nuevo
                          </span>
                        )}
                      </>
                    )}
                    {activeView === item.id && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1 bottom-1 w-0.5 bg-amber-500 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {(!collapsed || isMobile) && (
        <div className="p-3 border-t border-amber-500/10">
          <p className="text-[9px] text-amber-500/30 font-serif italic text-center">
            "Como es arriba, es abajo"
          </p>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-950 border-r border-amber-500/10 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 220 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen sticky top-0 bg-zinc-950 border-r border-amber-500/10 shrink-0 overflow-hidden z-30"
    >
      {sidebarContent}
    </motion.aside>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState<ViewId>("library");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    synthInstance.setMute(isAudioMuted);
  }, [isAudioMuted]);

  const currentNav = NAV_ITEMS.find(n => n.id === activeView);

  return (
    <div className="min-h-screen bg-zinc-950 text-amber-50 flex selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,80,24,0.10),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-amber-500/4 rounded-full filter blur-[100px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/4 rounded-full filter blur-[100px] pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        isMobile={isMobile}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-amber-500/10 px-4 md:px-6 py-3 flex items-center gap-3">
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-all"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg">{currentNav?.emoji}</span>
            <h1 className="text-sm font-bold font-serif text-amber-400 truncate">{currentNav?.label}</h1>
            {currentNav?.isNew && (
              <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                Nuevo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex px-2.5 py-1.5 rounded-md border border-amber-500/10 bg-zinc-900/30 text-[10px] text-amber-200/50 items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DeepSeek AI</span>
            </div>
            <InstallPWA />
            <ThemeToggle />
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="px-2.5 py-1.5 rounded-md border border-amber-500/20 bg-zinc-900/50 hover:bg-zinc-900 text-amber-100/80 transition-all flex items-center gap-1.5 text-xs"
              title={isAudioMuted ? "Activar audio ritual" : "Silenciar"}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
            </button>
          </div>
        </header>

        {/* View content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <React.Suspense fallback={
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-xs tracking-widest uppercase text-amber-500/50 animate-pulse">Abriendo el portal...</p>
            </div>
          }>
            <AnimatePresence mode="wait">
              {activeView === "library" && <LibraryView key="library" />}
              {activeView === "oracle" && <OracleView key="oracle" />}
              {activeView === "cinema" && <CinemaView key="cinema" />}
              {activeView === "books" && <BooksView key="books" />}
              {activeView === "pathworking" && <PathworkingView key="pathworking" />}
              {activeView === "gematria" && <GematriaView key="gematria" />}
              {activeView === "sigil" && <SigilView key="sigil" />}
              {activeView === "tarot" && <TarotView key="tarot" />}
              {activeView === "lunar" && <LunarView key="lunar" />}
              {activeView === "dreams" && <DreamView key="dreams" />}
              {activeView === "correspondences" && <CorrespondencesView key="correspondences" />}
              {activeView === "astrology" && <AstrologyView key="astrology" />}
              {activeView === "meditations" && <MeditationView key="meditations" />}
              {activeView === "kundalini" && <KundaliniView key="kundalini" />}
              {activeView === "rituals" && <RitualsView key="rituals" />}
              {activeView === "visualization" && <VisualizationView key="visualization" />}
              {activeView === "magic_path" && <MagicPathTest key="magic_path" />}
              {activeView === "archetype" && <ArchetypeView key="archetype" />}
              {activeView === "pathworking22" && <Pathworking22View key="pathworking22" />}
              {activeView === "mapa_genetico" && <MapaGeneticoCompleto key="mapa_genetico" />}
              {activeView === "journal" && <JournalView key="journal" />}
            </AnimatePresence>
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EXISTING VIEWS (kept inline for compatibility)
// ══════════════════════════════════════════════════════════════

function LibraryView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSymbol, setActiveSymbol] = useState<EsotericSymbol | null>(SYMBOLS_DATABASE[0]);
  const [depth, setDepth] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [aiContext, setAiContext] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [errorStr, setErrorStr] = useState("");

  const handleAmplificaIA = async (symbolName: string) => {
    setAiLoading(true); setErrorStr(""); setAiResult(null);
    synthInstance.playChime(370, 1.5, "triangle");
    try {
      const data = await safeFetchJSON("/api/decode", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: symbolName, context: aiContext || "Dame un análisis avanzado con claves astrológicas correspondientes." })
      }, "Falla en transmutación estelar.");
      setAiResult(data); synthInstance.playChime(523.25, 2.0, "sine");
    } catch (e: any) { setErrorStr(e.message); } finally { setAiLoading(false); }
  };

  const filteredSymbols = SYMBOLS_DATABASE.filter(sym => {
    const matchesCat = selectedCategory === "all" || sym.category === selectedCategory;
    const matchesSearch = sym.name.toLowerCase().includes(searchTerm.toLowerCase()) || sym.association.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50 w-4 h-4" />
          <input type="text" placeholder="Filtrar símbolos, claves..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-zinc-900 border border-amber-500/20 rounded-lg py-2.5 pl-10 pr-4 text-xs text-amber-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400" />
          {searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400"><X className="w-4 h-4" /></button>}
        </div>
        <div className="relative z-20">
          <button onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold hover:bg-zinc-900 transition-all">
            <div className="flex items-center gap-2">
              <span>{selectedCategory === "all" ? "🌌" : CATEGORIES.find(c => c.id === selectedCategory)?.emoji}</span>
              <span>{selectedCategory === "all" ? "Todas las Categorías" : CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {isCategoryMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-950 border border-amber-500/30 rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto">
                <button onClick={() => { setSelectedCategory("all"); setIsCategoryMenuOpen(false); }} className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2 ${selectedCategory === "all" ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-500" : "text-zinc-400 hover:bg-zinc-900"}`}>
                  <span>🌌</span><span>Todas las Categorías</span>
                </button>
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setIsCategoryMenuOpen(false); const f = SYMBOLS_DATABASE.find(s => s.category === cat.id); if (f) { setActiveSymbol(f); setAiResult(null); } }} className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2 ${selectedCategory === cat.id ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-500" : "text-zinc-400 hover:bg-zinc-900"}`}>
                    <span>{cat.emoji}</span><span>{cat.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="bg-zinc-900/40 rounded-xl border border-amber-500/10 max-h-[460px] overflow-y-auto p-2 flex flex-col gap-1">
          <div className="text-[10px] text-amber-100/40 uppercase tracking-widest px-2 py-1 mb-1 border-b border-zinc-800/50 pb-1.5 flex justify-between">
            <span>Símbolos ({filteredSymbols.length})</span><span className="text-amber-500/40">7 Categorías</span>
          </div>
          {filteredSymbols.map(sym => (
            <button key={sym.id} onClick={() => { setActiveSymbol(sym); setAiResult(null); synthInstance.playChime(330, 0.4); }} className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${activeSymbol?.id === sym.id ? "bg-amber-500/10 border border-amber-500/30 text-amber-200" : "border border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-amber-100/90"}`}>
              <div className="flex items-center gap-2.5"><span className="text-lg">{sym.emoji}</span><div><div className="text-xs font-semibold">{sym.name}</div><div className="text-[10px] opacity-60 truncate max-w-[190px]">{sym.association}</div></div></div>
              <ChevronRight className={`w-3.5 h-3.5 opacity-50 transition-transform ${activeSymbol?.id === sym.id ? "rotate-90 text-amber-400" : ""}`} />
            </button>
          ))}
          {filteredSymbols.length === 0 && <div className="text-center py-8 text-zinc-500 text-xs">Ningún símbolo coincide.</div>}
        </div>
      </div>

      <div className="lg:col-span-8">
        {activeSymbol ? (
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/25 shadow-xl flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />
              <div className="flex justify-between items-start border-b border-amber-500/10 pb-4">
                <div className="flex gap-4 items-center">
                  <div className="text-4xl bg-zinc-900 border border-amber-500/20 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">{activeSymbol.emoji}</div>
                  <div>
                    <h2 className="text-xl font-bold font-serif text-amber-400">{activeSymbol.name}{activeSymbol.gematria && <span className="text-xs text-amber-200/50 font-sans ml-2">({activeSymbol.gematria})</span>}</h2>
                    <p className="text-xs text-amber-100/60">{activeSymbol.association}</p>
                    <p className="text-[10px] mt-1 uppercase text-amber-500/50 tracking-widest bg-amber-500/5 px-2 py-0.5 rounded inline-block">{CATEGORIES.find(c => c.id === activeSymbol.category)?.name}</p>
                  </div>
                </div>
                {/* Depth selector — smaller compact buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => { setDepth("beginner"); synthInstance.playChime(220, 0.7); }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg border transition-all ${
                      depth === "beginner"
                        ? "bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-lg shadow-emerald-500/10"
                        : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-lg">🌱</span>
                    <span className="text-xs font-bold uppercase tracking-wide">Principiante</span>
                    <span className="text-[10px] text-current opacity-60 hidden sm:block">Neófito</span>
                  </button>
                  <button
                    onClick={() => { setDepth("intermediate"); synthInstance.playChime(330, 0.7); }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg border transition-all ${
                      depth === "intermediate"
                        ? "bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10"
                        : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-lg">🌿</span>
                    <span className="text-xs font-bold uppercase tracking-wide">Intermedio</span>
                    <span className="text-[10px] text-current opacity-60 hidden sm:block">Practicante</span>
                  </button>
                  <button
                    onClick={() => { setDepth("advanced"); synthInstance.playChime(440, 0.7); }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-lg border transition-all ${
                      depth === "advanced"
                        ? "bg-purple-500/15 border-purple-500/60 text-purple-300 shadow-lg shadow-purple-500/10"
                        : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-lg">🌳</span>
                    <span className="text-xs font-bold uppercase tracking-wide">Avanzado</span>
                    <span className="text-[10px] text-current opacity-60 hidden sm:block">Iniciado</span>
                  </button>
                </div>
              </div>
              {/* Content area — smaller text, more padding */}
              <div className="flex flex-col gap-4 text-sm leading-relaxed text-amber-100/90 font-serif min-h-[160px] p-5 bg-zinc-900/30 rounded-xl border border-amber-500/5">
                {depth === "beginner" && (
                  <div className="space-y-3">
                    <p className="font-sans italic text-emerald-400/80 border-l-2 border-emerald-500/40 pl-3 text-sm flex items-center gap-2">🌱 Acceso básico — Neófito</p>
                    <p className="text-justify font-sans text-sm leading-relaxed">{activeSymbol.beginner}</p>
                  </div>
                )}
                {depth === "intermediate" && (
                  <div className="space-y-3">
                    <p className="font-sans italic text-amber-400/80 border-l-2 border-amber-500/40 pl-3 text-sm flex items-center gap-2">🌿 Correspondencias — Cábala, Tarot y Alquimia</p>
                    <p className="text-justify font-sans text-sm leading-relaxed">{activeSymbol.intermediate}</p>
                  </div>
                )}
                {depth === "advanced" && (
                  <div className="space-y-4">
                    <p className="font-sans italic text-purple-400/80 border-l-2 border-purple-500/40 pl-3 text-sm flex items-center gap-2">🌳 Teúrgia ceremonial — Ritual operativo</p>
                    <p className="text-justify font-sans text-sm leading-relaxed">{activeSymbol.advanced}</p>
                    <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl text-sm text-amber-200 font-sans">
                      <strong className="text-amber-500 uppercase tracking-wider block mb-2">⚠️ Advertencia Iniciática:</strong>
                      Las prácticas ceremoniales requieren quietud mental y protección astral previa.
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-zinc-900/50 p-5 rounded-xl border border-amber-500/10 flex flex-col gap-4">
              <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /><h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Amplificación Hermética IA</h3></div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" placeholder="Pregunta al oráculo..." value={aiContext} onChange={e => setAiContext(e.target.value)} disabled={aiLoading} className="flex-grow bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-3 text-xs placeholder-zinc-600 focus:outline-none focus:border-amber-400 text-amber-100" />
                <button onClick={() => handleAmplificaIA(activeSymbol.name)} disabled={aiLoading} className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold px-4 py-2 rounded-lg text-xs uppercase transition-all flex items-center gap-2">
                  {aiLoading ? "Invocando..." : "Amplificar"}{aiLoading ? <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-ping" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {errorStr && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">❌ {errorStr}</div>}
              {aiLoading && <div className="py-8 flex flex-col items-center gap-3"><div className="w-8 h-8 rounded-full border border-amber-500 border-t-transparent animate-spin" /><p className="text-xs italic text-amber-400/80 animate-pulse">Invocando sabiduría celestial...</p></div>}
              {aiResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-amber-500/20 rounded-xl bg-zinc-950 p-5 flex flex-col gap-4 font-serif text-xs leading-relaxed">
                  {aiResult.etimologia && <div><span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">⚜️ Etimología</span><p>{aiResult.etimologia}</p></div>}
                  {aiResult.cabala && <div><span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">🌳 Cábala</span><p>{aiResult.cabala}</p></div>}
                  {aiResult.tarot && <div><span className="text-amber-400 uppercase tracking-wider font-semibold block text-[10px] font-sans mb-1">🃏 Tarot</span><p>{aiResult.tarot}</p></div>}
                  {aiResult.practica_mágica && <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg"><span className="text-amber-500 uppercase tracking-wider font-bold block text-[10px] font-sans mb-1">⚡ Práctica</span><p>{aiResult.practica_mágica}</p></div>}
                  {aiResult.paradoja_esoterica && <div className="text-center italic text-amber-300 border-t border-amber-500/10 pt-3">"{aiResult.paradoja_esoterica}"</div>}
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full py-20 flex flex-col items-center justify-center border border-dashed border-amber-500/20 rounded-2xl">
            <Compass className="w-12 h-12 text-amber-500/20 mb-3 animate-spin" />
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Selecciona un símbolo</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function OracleView() {
  const [term, setTerm] = useState(""); const [context, setContext] = useState(""); const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null); const [errorStr, setErrorStr] = useState("");
  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault(); if (!term.trim()) return; setLoading(true); setErrorStr(""); setResult(null); synthInstance.playChime(370, 2.0, "triangle");
    try { const data = await safeFetchJSON("/api/decode", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ term, context }) }, "La sabiduría celeste se opone."); setResult(data); synthInstance.playChime(523.25, 2.0, "sine"); } catch (err: any) { setErrorStr(err.message); } finally { setLoading(false); }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4"><Sparkles className="w-6 h-6 text-amber-400 animate-pulse" /><div><h2 className="text-lg font-bold font-serif text-amber-400">Oráculo de Decodificación Integral</h2><p className="text-xs text-amber-100/60">Evoca la Gnosis. Analiza cualquier término esotérico, concepto o símbolo.</p></div></div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-amber-500/60 uppercase tracking-widest mr-1">Sugeridos:</span>
          {[["La Piedra Filosofal", "¿Relación con la etapa rubedo?"], ["Abraxas", "Simbología gnóstica."], ["Tetractys", "La década pitagórica."], ["El Santo Grial", "Interpretación hermética."]].map(([t, c]) => (
            <button key={t} onClick={() => { setTerm(t); setContext(c); }} className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 border border-amber-500/10 transition-all">{t}</button>
          ))}
        </div>
        <form onSubmit={handleDecode} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2"><label className="text-[10px] text-amber-400 font-bold uppercase">Término:</label><input type="text" required value={term} onChange={e => setTerm(e.target.value)} placeholder="Sigilo de Rafael, Ain Soph Aur..." className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400" /></div>
            <div className="flex flex-col gap-2"><label className="text-[10px] text-amber-400 font-bold uppercase">Contexto (Opcional):</label><input type="text" value={context} onChange={e => setContext(e.target.value)} placeholder="¿Tiene conexiones con...?" className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400" /></div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2">
            {loading ? "Emanando Sabiduría..." : "Invocar Sabiduría del Oráculo"}{loading ? <span className="w-2 h-2 rounded-full bg-zinc-400 animate-ping" /> : <Sparkles className="w-4 h-4 text-zinc-950" />}
          </button>
        </form>
        {errorStr && <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {errorStr}</div>}
      </div>
      {loading && <div className="py-20 flex flex-col items-center gap-4"><div className="relative w-16 h-16"><div className="absolute inset-0 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin" /><div className="absolute inset-2 rounded-full border border-purple-500/20 border-b-purple-500 animate-spin" /></div><p className="text-xs italic text-amber-400 animate-pulse text-center">Interpretando gematría y correspondencias...</p></div>}
      {result && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 shadow-2xl flex flex-col gap-6 relative">
          <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center"><h3 className="text-sm font-bold font-serif text-amber-400 uppercase">⚜️ Pergamino: {term}</h3><span className="text-[10px] text-amber-200/60 font-mono">DeepSeek Reasoner</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-amber-100 font-serif leading-relaxed">
            <div className="flex flex-col gap-4">
              {result.etimologia && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-1">Etimología</h4><p>{result.etimologia}</p></div>}
              {result.cabala && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-1">🌳 Cábala</h4><p>{result.cabala}</p></div>}
              {result.tarot && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-1">🃏 Tarot</h4><p>{result.tarot}</p></div>}
            </div>
            <div className="flex flex-col gap-4">
              {result.hermetismo && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-1">Hermetismo</h4><p>{result.hermetismo}</p></div>}
              {result.alquimia && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-1">🧪 Alquimia</h4><p>{result.alquimia}</p></div>}
              {result.practica_mágica && <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/15"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-500 mb-1">⚡ Práctica</h4><p>{result.practica_mágica}</p></div>}
            </div>
          </div>
          {result.paradoja_esoterica && <div className="text-center p-4 border border-zinc-800 rounded-xl bg-zinc-950/50"><p className="italic text-amber-300 text-sm">"{result.paradoja_esoterica}"</p></div>}
        </motion.div>
      )}
    </motion.div>
  );
}

function CinemaView() {
  const [movieName, setMovieName] = useState(""); const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null); const [errorStr, setErrorStr] = useState("");
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault(); if (!movieName.trim()) return; setLoading(true); setErrorStr(""); setResult(null); synthInstance.playChime(261.63, 1.8);
    try { const data = await safeFetchJSON("/api/analyze-movie", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ movie: movieName }) }, "Las musas del teatro oscurecieron los carretes."); setResult(data); synthInstance.playChime(392, 1.5, "triangle"); } catch (err: any) { setErrorStr(err.message); } finally { setLoading(false); }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4"><Film className="w-6 h-6 text-amber-400 animate-pulse" /><div><h2 className="text-lg font-bold font-serif text-amber-400">Cine Gnóstico e Iniciático</h2><p className="text-xs text-amber-100/60">Analiza películas bajo la óptica de la Cábala, Gnosticismo y Alquimia.</p></div></div>
        <div className="flex flex-wrap gap-1.5">{["The Matrix", "El Show de Truman", "Interstellar", "Inception", "El Laberinto del Fauno"].map(f => (<button key={f} onClick={() => setMovieName(f)} className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 border border-amber-500/10 transition-all">🎥 {f}</button>))}</div>
        <form onSubmit={handleAnalyze} className="flex gap-2.5"><input type="text" required value={movieName} onChange={e => setMovieName(e.target.value)} placeholder="Título de la película..." className="flex-grow bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400" /><button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs uppercase transition-all">{loading ? "Analizando..." : "Analizar"}</button></form>
        {errorStr && <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {errorStr}</div>}
      </div>
      {loading && <div className="py-20 flex flex-col items-center gap-4"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /><p className="text-xs italic text-amber-400 animate-pulse text-center">Escrutando revelaciones gnósticas...</p></div>}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 shadow-2xl flex flex-col gap-6">
          <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center"><h3 className="text-base font-bold font-serif text-amber-400">🎬 {movieName}</h3><span className="text-[9px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Gnosis IA</span></div>
          <div className="flex flex-col gap-6 text-xs text-amber-100 font-serif leading-relaxed">
            {result.sinopsis_esoterica && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-2">Sinopsis Gnóstica</h4><p className="italic border-l-2 border-amber-500/30 pl-3">{result.sinopsis_esoterica}</p></div>}
            {result.arquetipos?.length > 0 && <div><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-3">Arquetipos</h4><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{result.arquetipos.map((a: any, i: number) => <div key={i} className="p-3 bg-zinc-950 rounded-lg border border-amber-500/5"><span className="font-bold text-amber-300 text-[11px] font-sans">{a.personaje}</span><span className="text-[10px] text-amber-500 font-semibold block">{a.arquetipo}</span><p className="text-[10px] text-amber-100/60 font-sans mt-1">{a.significado || a.descripcion}</p></div>)}</div></div>}
            {result.fases_transmutacion && <div className="p-5 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 border-b border-amber-500/10 pb-2 mb-4">Las 3 Etapas Alquímicas</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="p-3 bg-zinc-950/80 rounded-lg border-l-2 border-zinc-500"><span className="font-bold text-zinc-300 text-xs uppercase font-sans">🖤 Nigredo</span><p className="text-[10px] text-amber-100/70 font-sans mt-1">{result.fases_transmutacion.nigredo || result.fases_transmutacion.fase_1}</p></div><div className="p-3 bg-zinc-950/80 rounded-lg border-l-2 border-amber-200/50"><span className="font-bold text-amber-100 text-xs uppercase font-sans">🤍 Albedo</span><p className="text-[10px] text-amber-100/70 font-sans mt-1">{result.fases_transmutacion.albedo || result.fases_transmutacion.fase_2}</p></div><div className="p-3 bg-zinc-950/80 rounded-lg border-l-2 border-red-500"><span className="font-bold text-red-400 text-xs uppercase font-sans">❤️ Rubedo</span><p className="text-[10px] text-amber-100/70 font-sans mt-1">{result.fases_transmutacion.rubedo || result.fases_transmutacion.fase_3}</p></div></div></div>}
            {result.conclusion_gnostica && <div className="text-center border-t border-amber-500/10 pt-4"><p className="italic text-amber-300 font-sans text-sm">"{result.conclusion_gnostica}"</p></div>}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function BooksView() {
  const [bookName, setBookName] = useState(""); const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null); const [errorStr, setErrorStr] = useState("");
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault(); if (!bookName.trim()) return; setLoading(true); setErrorStr(""); setResult(null); synthInstance.playChime(261.63, 1.8);
    try { const data = await safeFetchJSON("/api/analyze-book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ book: bookName }) }, "Las musas oscurecieron los pergaminos."); setResult(data); synthInstance.playChime(392, 1.5, "triangle"); } catch (err: any) { setErrorStr(err.message); } finally { setLoading(false); }
  };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4"><BookOpen className="w-6 h-6 text-amber-400 animate-pulse" /><div><h2 className="text-lg font-bold font-serif text-amber-400">Libros e Iniciación Literaria</h2><p className="text-xs text-amber-100/60">Analiza textos sagrados bajo la óptica del Gnosticismo y Alta Magia.</p></div></div>
        <div className="flex flex-wrap gap-1.5">{["El Kybalion", "El Zohar", "La Doctrina Secreta", "Dogma y Ritual de la Alta Magia", "Corpus Hermeticum"].map(f => (<button key={f} onClick={() => setBookName(f)} className="px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-900 text-[10px] text-amber-200/70 border border-amber-500/10 transition-all">📜 {f}</button>))}</div>
        <form onSubmit={handleAnalyze} className="flex gap-2.5"><input type="text" required value={bookName} onChange={e => setBookName(e.target.value)} placeholder="Título del libro o texto sagrado..." className="flex-grow bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400" /><button type="submit" disabled={loading} className="bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold px-6 py-3 rounded-xl text-xs uppercase transition-all">{loading ? "Analizando..." : "Analizar"}</button></form>
        {errorStr && <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {errorStr}</div>}
      </div>
      {loading && <div className="py-20 flex flex-col items-center gap-4"><div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /><p className="text-xs italic text-amber-400 animate-pulse text-center">Escrutando revelaciones entre las páginas ancestrales...</p></div>}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 shadow-2xl flex flex-col gap-6">
          <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center"><h3 className="text-base font-bold font-serif text-amber-400">📖 {bookName}</h3><span className="text-[9px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">Gnosis IA</span></div>
          <div className="flex flex-col gap-6 text-xs text-amber-100 font-serif leading-relaxed">
            {result.sinopsis_esoterica && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-2">Sinopsis Gnóstica</h4><p className="italic border-l-2 border-amber-500/30 pl-3">{result.sinopsis_esoterica}</p></div>}
            {result.arquetipos?.length > 0 && <div><h4 className="text-[10px] font-sans font-bold uppercase text-amber-400 mb-3">Arquetipos Literarios</h4><div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">{result.arquetipos.map((a: any, i: number) => <div key={i} className="p-3 bg-zinc-950 rounded-lg border border-amber-500/5"><span className="font-bold text-amber-300 text-[11px] font-sans">{a.personaje || a.concepto}</span><span className="text-[10px] text-amber-500 font-semibold block">{a.arquetipo}</span><p className="text-[10px] text-amber-100/60 font-sans mt-1">{a.significado || a.descripcion}</p></div>)}</div></div>}
            {result.conclusion_gnostica && <div className="text-center border-t border-amber-500/10 pt-4"><p className="italic text-amber-300 font-sans text-sm">"{result.conclusion_gnostica}"</p></div>}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function PathworkingView() {
  const [focusType, setFocusType] = useState<"tarot" | "sefira" | "zodiaco" | "custom">("tarot");
  const [focusPreset, setFocusPreset] = useState("V - El Hierofante");
  const [customFocus, setCustomFocus] = useState("");
  const [loading, setLoading] = useState(false); const [result, setResult] = useState<any>(null); const [errorStr, setErrorStr] = useState("");
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "holdIn" | "exhale" | "holdOut">("inhale");
  const [secondsLeft, setSecondsLeft] = useState(4); const [breathCount, setBreathCount] = useState(0);
  const hummerRef = React.useRef<any>(null);
  React.useEffect(() => { return () => { if (hummerRef.current) hummerRef.current.stop(); }; }, []);
  const focusPresets: any = {
    tarot: ["0 - El Loco", "I - El Mago", "II - La Sacerdotisa", "X - Rueda de la Fortuna", "XIII - La Muerte", "XXI - El Mundo"],
    sefira: ["Sendero de Tav: Malkuth → Yesod", "Sefirá de Yesod", "Sefirá de Tiphereth", "Cruce del Abismo celestial"],
    zodiaco: ["Constelación de Orión", "Fuerza Estelar de Aries", "Mar cósmico de Piscis"]
  };
  React.useEffect(() => { if (focusType !== "custom" && focusPresets[focusType]) setFocusPreset(focusPresets[focusType][0]); }, [focusType]);
  React.useEffect(() => {
    let interval: any = null;
    if (isBreathingActive) {
      if (!hummerRef.current) hummerRef.current = synthInstance.createHumer();
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            let nextPhase: typeof breathPhase = "inhale";
            if (breathPhase === "inhale") { nextPhase = "holdIn"; synthInstance.playChime(392, 0.8); if (hummerRef.current) hummerRef.current.modulate(0.04, 0.1); }
            else if (breathPhase === "holdIn") { nextPhase = "exhale"; synthInstance.playChime(294, 0.8); if (hummerRef.current) hummerRef.current.modulate(0.005, 1.5); }
            else if (breathPhase === "exhale") { nextPhase = "holdOut"; synthInstance.playChime(220, 0.8); if (hummerRef.current) hummerRef.current.modulate(0.005, 0.1); }
            else { nextPhase = "inhale"; synthInstance.playChime(330, 0.8); if (hummerRef.current) hummerRef.current.modulate(0.04, 1.5); setBreathCount(c => c + 1); }
            setBreathPhase(nextPhase); return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else { if (hummerRef.current) { hummerRef.current.stop(); hummerRef.current = null; } }
    return () => { if (interval) clearInterval(interval); };
  }, [isBreathingActive, breathPhase]);

  const handleGeneratePathworking = async () => {
    const t = focusType === "custom" ? customFocus : focusPreset; if (!t.trim()) return;
    setLoading(true); setErrorStr(""); setResult(null); synthInstance.playChime(370, 2.0, "triangle");
    try { const data = await safeFetchJSON("/api/generate-pathworking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: t, focusType }) }, "Los centinelas astrales rechazaron tu firma."); setResult(data); synthInstance.playChime(523.25, 2.5); } catch (e: any) { setErrorStr(e.message); } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-3"><Compass className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} /><h3 className="text-sm font-bold font-serif text-amber-400">Forjador Senda Astral</h3></div>
          <p className="text-[11px] text-amber-100/60 leading-relaxed">Selecciona tu foco sagrado para el pathworking guiado por IA.</p>
          <div className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-zinc-950 rounded-lg border border-amber-500/10">
              {(["tarot", "sefira", "zodiaco", "custom"] as const).map(t => (
                <button key={t} onClick={() => { setFocusType(t); synthInstance.playChime(220, 0.4); }} className={`py-1.5 rounded transition-all text-[10px] font-semibold uppercase ${focusType === t ? "bg-amber-500/15 text-amber-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {t === "tarot" ? "🃏" : t === "sefira" ? "🌳" : t === "zodiaco" ? "✨" : "🗝️"}
                </button>
              ))}
            </div>
            {focusType !== "custom" ? (
              <select value={focusPreset} onChange={e => setFocusPreset(e.target.value)} className="w-full bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-3 text-xs text-amber-100 focus:outline-none focus:border-amber-400">
                {focusPresets[focusType]?.map((p: string) => <option key={p} value={p}>{p}</option>)}
              </select>
            ) : (
              <input type="text" placeholder="Foco astral personalizado..." value={customFocus} onChange={e => setCustomFocus(e.target.value)} className="w-full bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-3 text-xs text-amber-100 focus:outline-none focus:border-amber-400" />
            )}
            <button onClick={handleGeneratePathworking} disabled={loading} className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-800 disabled:text-zinc-600 border border-amber-400 text-zinc-950 font-bold rounded-xl text-xs uppercase transition-all flex items-center justify-center gap-1.5">
              {loading ? "Estructurando..." : "Forjar Sendero Astral"}{loading ? <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-ping" /> : <Compass className="w-4 h-4" />}
            </button>
          </div>
          {errorStr && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">❌ {errorStr}</div>}
        </div>
        <div className="bg-zinc-900/40 p-5 rounded-2xl border border-amber-500/10 flex flex-col gap-4">
          <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-2.5"><Activity className="w-4 h-4 text-amber-500 animate-pulse" /><div><h3 className="text-xs font-bold uppercase text-amber-400">Respiración Pranayama</h3><p className="text-[10px] text-amber-100/50">Sama Vritti 4-4-4-4</p></div></div>
          <div className="flex flex-col items-center py-4 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner relative">
            <div className={`absolute w-36 h-36 rounded-full bg-amber-500/5 filter blur-xl transition-transform duration-[4000ms] pointer-events-none ${isBreathingActive && breathPhase === "inhale" ? "scale-150 bg-amber-500/10" : "scale-100"}`} />
            <div className="z-10 text-center flex flex-col items-center gap-2">
              <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${breathPhase === "inhale" ? "text-amber-400" : breathPhase === "holdIn" ? "text-purple-400" : breathPhase === "exhale" ? "text-amber-500/80" : "text-zinc-500"}`}>
                {breathPhase === "inhale" ? "🌬️ Inhala" : breathPhase === "holdIn" ? "🧘 Retén" : breathPhase === "exhale" ? "💨 Exhala" : "🛑 Retén sin aire"}
              </span>
              <div className="relative w-20 h-20 rounded-full border border-amber-500/10 flex items-center justify-center bg-zinc-900/80">
                <span className="text-3xl font-serif font-bold text-amber-200">{secondsLeft}s</span>
                <div className={`absolute inset-0 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-transparent border-l-transparent transition-all duration-1000 ${secondsLeft === 4 ? "rotate-0" : secondsLeft === 3 ? "rotate-90" : secondsLeft === 2 ? "rotate-180" : "-rotate-90"}`} />
              </div>
              <span className="text-[10px] text-zinc-500">Ciclos: {breathCount}</span>
            </div>
            <div className="flex gap-2.5 mt-4 z-10">
              <button onClick={() => { setIsBreathingActive(!isBreathingActive); synthInstance.playChime(349, 1.0); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase flex items-center gap-1 border ${isBreathingActive ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-amber-500 border-amber-400 text-zinc-950 font-bold"}`}>
                {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}<span>{isBreathingActive ? "Pausar" : "Iniciar"}</span>
              </button>
              <button onClick={() => { setIsBreathingActive(false); setBreathPhase("inhale"); setSecondsLeft(4); setBreathCount(0); synthInstance.playChime(220, 1.5); }} className="px-2.5 py-1.5 rounded-lg border border-amber-500/20 bg-zinc-900 text-amber-200 text-xs"><RotateCcw className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-7">
        {loading && <div className="py-24 flex flex-col items-center gap-4 border border-amber-500/10 rounded-2xl bg-zinc-900/20"><Compass className="w-12 h-12 text-amber-500 animate-spin mb-2" style={{ animationDuration: "3s" }} /><p className="text-xs text-amber-400 font-mono uppercase animate-pulse">Forjando sendero astral...</p></div>}
        {result && !loading && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 p-6 rounded-2xl border border-amber-500/25 shadow-xl flex flex-col gap-6">
            <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center"><h3 className="text-base font-bold font-serif text-amber-400">🔮 {focusType === "custom" ? customFocus : focusPreset}</h3><span className="text-[9px] text-purple-400 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded font-mono">Portal Teúrgia IA</span></div>
            <div className="flex flex-col gap-5 text-xs text-amber-100 font-serif leading-relaxed max-h-[640px] overflow-y-auto pr-2">
              {result.preparacion && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><span className="text-amber-500 uppercase font-bold block text-[10px] mb-2 font-sans">🌱 Preparación</span><p className="italic">{result.preparacion}</p></div>}
              {result.viaje_narrativo && <div className="p-5 bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl border border-amber-500/20 shadow-inner"><span className="text-purple-400 uppercase font-bold block text-[10px] mb-3 font-sans">🌌 Viaje Guiado</span><div className="space-y-4 text-amber-100/90 whitespace-pre-line">{result.viaje_narrativo}</div></div>}
              {result.comunion_ritual && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><span className="text-amber-500 uppercase font-bold block text-[10px] mb-2 font-sans">👼 Comunión</span><p>{result.comunion_ritual}</p></div>}
              {result.retorno && <div className="p-4 bg-zinc-950 rounded-xl border border-amber-500/10"><span className="text-amber-500 uppercase font-bold block text-[10px] mb-2 font-sans">🪵 Retorno</span><p className="italic">{result.retorno}</p></div>}
              {result.mantra_afirmacion && <div className="text-center p-4 border border-zinc-800 rounded-xl bg-zinc-950"><p className="font-bold text-amber-300 font-sans text-base">"{result.mantra_afirmacion}"</p></div>}
            </div>
          </motion.div>
        )}
        {!result && !loading && <div className="h-full py-24 flex flex-col items-center justify-center border border-dashed border-amber-500/20 rounded-2xl"><Compass className="w-12 h-12 text-zinc-500/20 mb-3 animate-pulse" /><p className="text-zinc-500 text-xs uppercase text-center max-w-xs">Configura y forja tu sendero astral</p></div>}
      </div>
    </motion.div>
  );
}
