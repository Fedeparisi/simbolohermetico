import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RotateCcw, Download } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

// Austin Osman Spare sigil method:
// 1. Write the intent
// 2. Remove vowels and duplicate letters
// 3. Combine remaining letters into a single design
function buildSigilLetters(intent: string): string[] {
  const upper = intent.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, "");
  const noVowels = upper.replace(/[AEIOUÁÉÍÓÚÜ]/g, "");
  const unique: string[] = [];
  for (const c of noVowels) {
    if (!unique.includes(c)) unique.push(c);
  }
  return unique.length > 0 ? unique : upper.split("").filter((c, i, a) => a.indexOf(c) === i).slice(0, 8);
}

// Draw the sigil on a canvas using sacred geometry style
function drawSigil(
  canvas: HTMLCanvasElement,
  letters: string[],
  colorScheme: { bg: string; line: string; glow: string }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) * 0.38;

  ctx.clearRect(0, 0, W, H);

  // Background
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.5);
  bgGrad.addColorStop(0, colorScheme.bg + "33");
  bgGrad.addColorStop(1, "transparent");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Outer circle with glow
  ctx.save();
  ctx.shadowBlur = 18;
  ctx.shadowColor = colorScheme.glow;
  ctx.strokeStyle = colorScheme.line;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  // Inner circle
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Place letter nodes around the circle
  const n = letters.length;
  const nodes: { x: number; y: number; letter: string }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = ((i / n) * Math.PI * 2) - Math.PI / 2;
    const r = R * (0.75 + (i % 2 === 0 ? 0.15 : -0.1));
    nodes.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      letter: letters[i],
    });
  }

  // Draw connecting lines (the sigil body)
  if (nodes.length >= 2) {
    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = colorScheme.glow;
    ctx.strokeStyle = colorScheme.line;
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    // Connect each letter node to non-adjacent nodes forming the sigil
    for (let i = 0; i < nodes.length; i++) {
      const from = nodes[i];
      const to = nodes[(i + 2) % nodes.length]; // Skip 1 for more interesting shape
      if (i === 0) ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
    }
    // Also connect some to center
    for (let i = 0; i < Math.min(3, nodes.length); i++) {
      ctx.moveTo(nodes[i].x, nodes[i].y);
      // Small offset from exact center for mystical feel
      ctx.lineTo(cx + Math.sin(i * 1.3) * 12, cy + Math.cos(i * 1.3) * 12);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw letter glyphs at nodes
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = colorScheme.glow;
  ctx.fillStyle = colorScheme.line;
  ctx.font = `bold 13px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const node of nodes) {
    ctx.globalAlpha = 0.9;
    ctx.fillText(node.letter, node.x, node.y);
    // Small node circle
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = colorScheme.line;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.restore();

  // Center dot / seal
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = colorScheme.glow;
  ctx.fillStyle = colorScheme.line;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Sacred geometry: inner star if enough letters
  if (n >= 5) {
    ctx.save();
    ctx.strokeStyle = colorScheme.glow;
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = cx + Math.cos(a) * R * 0.35;
      const y = cy + Math.sin(a) * R * 0.35;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

const COLOR_SCHEMES = [
  { name: "Dorado Sagrado", bg: "#b45309", line: "#fbbf24", glow: "#f59e0b" },
  { name: "Púrpura Astral", bg: "#7c3aed", line: "#c4b5fd", glow: "#8b5cf6" },
  { name: "Esmeralda Hermético", bg: "#065f46", line: "#6ee7b7", glow: "#10b981" },
  { name: "Carmesí del Fuego", bg: "#991b1b", line: "#fca5a5", glow: "#ef4444" },
  { name: "Plata Lunar", bg: "#1e3a5f", line: "#bfdbfe", glow: "#60a5fa" },
];

export function SigilView() {
  const [intent, setIntent] = useState("");
  const [letters, setLetters] = useState<string[]>([]);
  const [colorIdx, setColorIdx] = useState(0);
  const [ritualLoading, setRitualLoading] = useState(false);
  const [ritual, setRitual] = useState<any>(null);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentScheme = COLOR_SCHEMES[colorIdx];

  const generateSigil = useCallback(() => {
    if (!intent.trim()) return;
    const ls = buildSigilLetters(intent);
    setLetters(ls);
    setGenerated(true);
    setRitual(null);
    synthInstance.playChime(370, 1.5, "triangle");
  }, [intent]);

  useEffect(() => {
    if (generated && canvasRef.current && letters.length > 0) {
      drawSigil(canvasRef.current, letters, currentScheme);
    }
  }, [generated, letters, colorIdx]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `sigilo-${intent.slice(0, 20).replace(/\s+/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    synthInstance.playChime(523, 1.5, "sine");
  };

  const handleGetRitual = async () => {
    if (!intent) return;
    setRitualLoading(true);
    setError("");
    synthInstance.playChime(294, 2.0, "triangle");
    try {
      const data = await safeFetchJSON("/api/sigil-ritual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, letters: letters.join("") })
      }, "Los dioses del caos guardaron silencio.");
      setRitual(data);
      synthInstance.playChime(440, 2.0, "sine");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRitualLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full flex flex-col gap-6"
    >
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">★</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Generador de Sigilos — Magia del Caos</h2>
            <p className="text-xs text-amber-100/60">Transmuta tu intención en un sello mágico según el método de Austin Osman Spare</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Tu Intención o Deseo Mágico:</label>
          <textarea
            value={intent}
            onChange={e => setIntent(e.target.value)}
            placeholder="Ej: Quiero claridad mental. Que la abundancia fluya. Protejo mi energía..."
            rows={2}
            className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
          />
          <p className="text-[10px] text-amber-100/40">Se eliminarán vocales y letras repetidas. Las letras restantes formarán el sigilo.</p>
        </div>

        {/* Color scheme selector */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Vibración Cromática:</span>
          <div className="flex gap-2 flex-wrap">
            {COLOR_SCHEMES.map((s, i) => (
              <button
                key={s.name}
                onClick={() => { setColorIdx(i); if (generated) setTimeout(() => drawSigil(canvasRef.current!, letters, s), 10); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${colorIdx === i ? "border-amber-500/60 bg-amber-500/10 text-amber-300" : "border-zinc-700 text-zinc-400 hover:border-amber-500/30"}`}
              >
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: s.glow }} />
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateSigil}
          disabled={!intent.trim()}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2"
        >
          ★ Forjar Sigilo Mágico
        </button>
      </div>

      {/* Sigil Canvas */}
      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Canvas */}
            <div className="bg-zinc-950 rounded-2xl border border-amber-500/20 p-6 flex flex-col items-center gap-4 shadow-2xl">
              <div className="text-[10px] text-amber-500/50 uppercase tracking-widest">Sigilo Forjado</div>
              <canvas
                ref={canvasRef}
                width={300}
                height={300}
                className="rounded-xl"
                style={{ background: "radial-gradient(circle at center, #1a0f00 0%, #09090b 100%)" }}
              />
              <div className="text-[10px] text-zinc-500 italic text-center">
                Letras activas: {letters.join(" · ")}
              </div>
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 bg-zinc-900 border border-amber-500/20 hover:border-amber-500/40 text-amber-300 text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PNG
                </button>
                <button
                  onClick={() => generateSigil()}
                  className="px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-400 rounded-lg hover:text-amber-200 transition-all"
                  title="Regenerar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Info + Ritual */}
            <div className="flex flex-col gap-4">
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-amber-500/10 text-xs leading-relaxed font-serif text-amber-100/80">
                <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold font-sans mb-2">📜 El Método de Spare</div>
                <p className="mb-2">El sigilo es la encriptación visual de tu voluntad. Al eliminar las letras redundantes y las vocales, se destruye el ego consciente que bloquea el deseo, permitiendo que el mensaje llegue directo al inconsciente.</p>
                <p className="text-amber-100/50">Una vez creado, <strong className="text-amber-300">actívalo, olvídalo.</strong> El olvido consciente es el sello final de la magia del caos.</p>
              </div>

              <button
                onClick={handleGetRitual}
                disabled={ritualLoading}
                className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-xs tracking-wider uppercase text-purple-300 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                {ritualLoading ? "Invocando Rito..." : "Ritual de Activación (IA)"}
              </button>

              {error && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {error}</div>}

              {ritual && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900/50 p-4 rounded-xl border border-purple-500/20 flex flex-col gap-3 text-xs font-serif leading-relaxed"
                >
                  <div className="text-[10px] text-purple-400/80 uppercase tracking-widest border-b border-purple-500/10 pb-1.5">⚡ Ritual de Activación</div>
                  {ritual.preparacion && <div><span className="text-amber-400 text-[10px] uppercase font-sans font-bold">Preparación: </span>{ritual.preparacion}</div>}
                  {ritual.activacion && <div><span className="text-amber-400 text-[10px] uppercase font-sans font-bold">Activación: </span>{ritual.activacion}</div>}
                  {ritual.sellado && <div><span className="text-amber-400 text-[10px] uppercase font-sans font-bold">Sellado: </span>{ritual.sellado}</div>}
                  {ritual.mantra && <div className="text-center italic text-purple-300 border-t border-purple-500/10 pt-2">"{ritual.mantra}"</div>}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
