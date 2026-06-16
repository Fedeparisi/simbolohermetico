import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sliders, Palette, Sun, Moon, BookOpen, Sparkles, Check, Mail } from "lucide-react";
import { ALCHEMICAL_PALETTES, applyAlchemicalPalette } from "../utils/theme";

type Theme = "dark" | "light" | "sepia";

export function ConfiguracionView() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");
  const [activePaletteId, setActivePaletteId] = useState<string>("gold-cyan");

  useEffect(() => {
    // Load current theme
    const savedTheme = localStorage.getItem("hermetic-theme") as Theme;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
    
    // Load current palette
    const savedPalette = localStorage.getItem("hermetic-palette");
    if (savedPalette) {
      setActivePaletteId(savedPalette);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove("theme-light", "theme-sepia");
    if (newTheme !== "dark") {
      document.documentElement.classList.add(`theme-${newTheme}`);
    }
    localStorage.setItem("hermetic-theme", newTheme);
    setCurrentTheme(newTheme);
  };

  const handleSelectPalette = (paletteId: string) => {
    applyAlchemicalPalette(paletteId);
    setActivePaletteId(paletteId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto flex flex-col gap-8 pb-12"
    >
      {/* Header section */}
      <div className="relative bg-gradient-to-r from-zinc-900 to-zinc-950 p-6 md:p-8 rounded-2xl border border-glass-border shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-alchemical-gold/10 rounded-full filter blur-xl pointer-events-none" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-alchemical-gold/10 border border-alchemical-gold/25 flex items-center justify-center text-alchemical-gold shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-alchemical-gold">Configuración Alquímica</h2>
            <p className="text-xs text-on-surface-variant/70">
              Personaliza el plano visual y sintoniza los colores de tu sendero iniciático.
            </p>
          </div>
        </div>
      </div>

      {/* Grid containing settings options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Base Theme Selector */}
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-glass-border flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-glass-border pb-3">
            <Sun className="w-4 h-4 text-alchemical-gold" />
            <h3 className="text-sm font-bold font-serif text-alchemical-gold uppercase tracking-wider">
              Modo del Templo (Base)
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant/80 leading-relaxed">
            Ajusta la luminosidad del templo virtual. Esto aplica un filtro global sobre la interfaz.
          </p>

          <div className="flex flex-col gap-2.5 mt-2">
            {/* Dark Theme */}
            <button
              onClick={() => applyTheme("dark")}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                currentTheme === "dark"
                  ? "bg-alchemical-gold/15 border-alchemical-gold/40 text-alchemical-gold shadow-lg shadow-alchemical-gold/5"
                  : "bg-zinc-950/40 border-zinc-800/80 text-on-surface-variant/70 hover:bg-zinc-950/80 hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">Oscuridad (Nigredo)</div>
                  <div className="text-[10px] opacity-60">Ideal para el estudio nocturno y contemplativo</div>
                </div>
              </div>
              {currentTheme === "dark" && <Check className="w-4 h-4 text-alchemical-gold" />}
            </button>

            {/* Light Theme */}
            <button
              onClick={() => applyTheme("light")}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                currentTheme === "light"
                  ? "bg-alchemical-gold/15 border-alchemical-gold/40 text-alchemical-gold shadow-lg shadow-alchemical-gold/5"
                  : "bg-zinc-950/40 border-zinc-800/80 text-on-surface-variant/70 hover:bg-zinc-950/80 hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">Claridad (Albedo)</div>
                  <div className="text-[10px] opacity-60">Luz blanca para una lectura diurna despejada</div>
                </div>
              </div>
              {currentTheme === "light" && <Check className="w-4 h-4 text-alchemical-gold" />}
            </button>

            {/* Sepia Theme */}
            <button
              onClick={() => applyTheme("sepia")}
              className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                currentTheme === "sepia"
                  ? "bg-alchemical-gold/15 border-alchemical-gold/40 text-alchemical-gold shadow-lg shadow-alchemical-gold/5"
                  : "bg-zinc-950/40 border-zinc-800/80 text-on-surface-variant/70 hover:bg-zinc-950/80 hover:text-on-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-bold">Pergamino (Citrinitas)</div>
                  <div className="text-[10px] opacity-60">Tono sepia que emula los manuscritos antiguos</div>
                </div>
              </div>
              {currentTheme === "sepia" && <Check className="w-4 h-4 text-alchemical-gold" />}
            </button>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-zinc-900/60 p-6 rounded-2xl border border-glass-border flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-glass-border pb-3">
              <Sparkles className="w-4 h-4 text-alchemical-gold" />
              <h3 className="text-sm font-bold font-serif text-alchemical-gold uppercase tracking-wider">
                Gran Obra del Color
              </h3>
            </div>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed">
              Las paletas de colores inyectan variables de estilo CSS directamente en el portal web, alterando los colores del fondo, paneles, textos e indicadores visuales de forma coherente.
            </p>
            <p className="text-xs text-on-surface-variant/80 leading-relaxed">
              Selecciona una paleta de la lista inferior para transmutar el entorno de inmediato.
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-alchemical-gold/5 border border-alchemical-gold/20 rounded-xl text-[11px] text-alchemical-gold/90 font-serif italic text-center">
            "El universo responde a las vibraciones que eliges contemplar."
          </div>
        </div>

      </div>

      {/* Color transmutations palette section */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-glass-border flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-glass-border pb-3">
          <Palette className="w-4 h-4 text-alchemical-gold" />
          <h3 className="text-sm font-bold font-serif text-alchemical-gold uppercase tracking-wider">
            Paletas de Colores Iniciáticas (Selección Dinámica)
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ALCHEMICAL_PALETTES.map((palette) => {
            const isActive = activePaletteId === palette.id;
            return (
              <button
                key={palette.id}
                onClick={() => handleSelectPalette(palette.id)}
                className={`p-4 rounded-xl border flex flex-col gap-3 relative text-left transition-all hover:bg-zinc-900/80 cursor-pointer ${
                  isActive
                    ? "bg-alchemical-gold/10 border-alchemical-gold/40 shadow-lg shadow-alchemical-gold/5"
                    : "bg-zinc-950/20 border-zinc-800/40"
                }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div>
                    <h4 className="text-xs font-bold font-serif text-on-surface flex items-center gap-1.5">
                      {palette.name}
                      {isActive && (
                        <span className="text-[8px] bg-alchemical-gold/20 text-alchemical-gold px-1.5 py-0.5 rounded font-sans uppercase">
                          Activo
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                      {palette.description}
                    </p>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-alchemical-gold shrink-0" />}
                </div>

                {/* Palette dots */}
                <div className="flex items-center gap-2 mt-auto w-full">
                  <span className="text-[9px] text-on-surface-variant/40 font-mono">Componentes:</span>
                  <div className="flex gap-1.5">
                    {palette.colors.map((c, idx) => (
                      <div
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-zinc-900/60 p-6 rounded-2xl border border-glass-border flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-lg bg-alchemical-gold/10 border border-alchemical-gold/25 flex items-center justify-center text-alchemical-gold shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-serif text-alchemical-gold uppercase tracking-wider">
              Contacto con el Autor
            </h3>
            <p className="text-xs text-on-surface-variant/70 mt-0.5">
              ¿Tienes sugerencias o comentarios sobre la sabiduría hermética del portal? Escribe al escriba de esta obra.
            </p>
          </div>
        </div>
        <a
          href="mailto:lospodcastsecretos@gmail.com"
          className="px-4 py-2.5 bg-alchemical-gold/10 border border-alchemical-gold/30 hover:bg-alchemical-gold/20 text-alchemical-gold hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 font-mono"
        >
          <span>lospodcastsecretos@gmail.com</span>
        </a>
      </div>
    </motion.div>
  );
}
