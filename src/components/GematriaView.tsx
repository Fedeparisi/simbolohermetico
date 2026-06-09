import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hash, Sparkles, RotateCcw, ArrowRight } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

// Hebrew alphabet with numerical values (Mispar Gadol)
const HEBREW_LETTERS: { letter: string; name: string; value: number; transliteration: string }[] = [
  { letter: "א", name: "Alef", value: 1, transliteration: "A" },
  { letter: "ב", name: "Bet", value: 2, transliteration: "B" },
  { letter: "ג", name: "Gimel", value: 3, transliteration: "G" },
  { letter: "ד", name: "Dalet", value: 4, transliteration: "D" },
  { letter: "ה", name: "He", value: 5, transliteration: "H" },
  { letter: "ו", name: "Vav", value: 6, transliteration: "V/W" },
  { letter: "ז", name: "Zayin", value: 7, transliteration: "Z" },
  { letter: "ח", name: "Jet", value: 8, transliteration: "Ch" },
  { letter: "ט", name: "Tet", value: 9, transliteration: "T" },
  { letter: "י", name: "Yod", value: 10, transliteration: "Y" },
  { letter: "כ", name: "Kaf", value: 20, transliteration: "K" },
  { letter: "ל", name: "Lamed", value: 30, transliteration: "L" },
  { letter: "מ", name: "Mem", value: 40, transliteration: "M" },
  { letter: "נ", name: "Nun", value: 50, transliteration: "N" },
  { letter: "ס", name: "Samej", value: 60, transliteration: "S" },
  { letter: "ע", name: "Ayin", value: 70, transliteration: "Aa" },
  { letter: "פ", name: "Pe", value: 80, transliteration: "P/F" },
  { letter: "צ", name: "Tzadi", value: 90, transliteration: "Tz" },
  { letter: "ק", name: "Kof", value: 100, transliteration: "Q" },
  { letter: "ר", name: "Resh", value: 200, transliteration: "R" },
  { letter: "ש", name: "Shin", value: 300, transliteration: "Sh/S" },
  { letter: "ת", name: "Tav", value: 400, transliteration: "T/Th" },
];

// Spanish/Latin to Hebrew value mapping (simplified transliteration)
const LATIN_TO_VALUE: Record<string, number> = {
  a: 1, á: 1, e: 5, é: 5, i: 10, í: 10, o: 70, ó: 70, u: 6, ú: 6,
  b: 2, v: 6, g: 3, d: 4, h: 5, w: 6, z: 7, ch: 8, t: 9, y: 10,
  k: 20, c: 20, l: 30, m: 40, n: 50, s: 60, p: 80, f: 80,
  tz: 90, q: 100, r: 200, sh: 300, x: 300, j: 300,
};

// Famous gematria equivalences
const FAMOUS_VALUES: Record<number, string[]> = {
  72: ["Shem HaMephorash (72 Nombres de Dios)", "Los 72 ángeles cabalísticos"],
  26: ["YHVH (יהוה) — El Tetragrama", "Adonai (en valor reducido)"],
  10: ["Yod (י) — La chispa divina", "Las 10 Sefirot"],
  18: ["Chai (חי) — Vida"],
  36: ["36 Tzadikim Nistarim (justos ocultos)"],
  40: ["Mem (מ) — Las aguas primordiales", "40 días de purificación"],
  216: ["El Nombre Oculto de 216 letras"],
  32: ["32 senderos de la Sabiduría (Sefer Yetzirah)"],
  13: ["Echad (אחד) — Unidad", "Ahavah (אהבה) — Amor"],
  11: ["Las 11 Qlifot"],
  7: ["Las 7 esferas planetarias", "Los 7 días de la creación"],
  3: ["La Trinidad", "Los 3 pilares del Árbol"],
  4: ["Los 4 elementos", "Las 4 letras del Tetragrama"],
};


function calculateGematria(text: string) {
  const lower = text.toLowerCase().replace(/\s+/g, "");
  let misparGadol = 0;
  let i = 0;
  const breakdown: { char: string; value: number }[] = [];

  while (i < lower.length) {
    const two = lower.slice(i, i + 2);
    if ((two === "ch" || two === "sh" || two === "tz") && LATIN_TO_VALUE[two]) {
      breakdown.push({ char: two.toUpperCase(), value: LATIN_TO_VALUE[two] });
      misparGadol += LATIN_TO_VALUE[two];
      i += 2;
    } else {
      const char = lower[i];
      const val = LATIN_TO_VALUE[char] || 0;
      if (val > 0) breakdown.push({ char: char.toUpperCase(), value: val });
      misparGadol += val;
      i++;
    }
  }

  // Mispar Katan (digital root)
  let katan = misparGadol;
  while (katan > 9) {
    katan = String(katan).split("").reduce((s, d) => s + parseInt(d), 0);
  }

  // Mispar Siduri (positional value 1-22)
  const uniqueChars = [...new Set(lower.replace(/[^a-záéíóúüñ]/g, "").split(""))];
  const siduri = uniqueChars.length * 3 + katan;

  return { misparGadol, misparKatan: katan, misparSiduri: siduri % 400 + 1, breakdown };
}

export function GematriaView() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [hebrewInput, setHebrewInput] = useState("");

  const handleCalculate = () => {
    if (!input.trim() && !hebrewInput.trim()) return;
    synthInstance.playChime(294, 1.2, "sine");
    const text = hebrewInput || input;

    if (hebrewInput) {
      // Calculate directly from Hebrew letters
      let total = 0;
      const breakdown: { char: string; value: number }[] = [];
      for (const char of hebrewInput) {
        const letter = HEBREW_LETTERS.find(l => l.letter === char);
        if (letter) {
          total += letter.value;
          breakdown.push({ char: letter.letter, value: letter.value });
        }
      }
      let katan = total;
      while (katan > 9) katan = String(katan).split("").reduce((s, d) => s + parseInt(d), 0);
      setResult({ misparGadol: total, misparKatan: katan, misparSiduri: (total % 400) + 1, breakdown });
    } else {
      setResult(calculateGematria(text));
    }
    setAiResult(null);
    setError("");
  };

  const handleAIInterpret = async () => {
    if (!result) return;
    setAiLoading(true);
    setError("");
    synthInstance.playChime(370, 1.5, "triangle");
    try {
      const data = await safeFetchJSON("/api/gematria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: input || hebrewInput, value: result.misparGadol, katan: result.misparKatan })
      }, "El Oráculo numérico guarda silencio.");
      setAiResult(data);
      synthInstance.playChime(523.25, 2.0, "sine");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const famousEq = result ? FAMOUS_VALUES[result.misparGadol] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">✡️</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Gematría & Numerología Hebrea</h2>
            <p className="text-xs text-amber-100/60">Calcula el valor numérico sagrado de palabras en hebreo o español transliterado</p>
          </div>
        </div>

        {/* Input section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              Palabra en Español / Transliteración:
            </label>
            <input
              type="text"
              value={input}
              onChange={e => { setInput(e.target.value); setHebrewInput(""); }}
              placeholder="Ej: Dios, Amor, Hermes, Sophia..."
              className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              O escribe directamente en Hebreo:
            </label>
            <input
              type="text"
              value={hebrewInput}
              onChange={e => { setHebrewInput(e.target.value); setInput(""); }}
              placeholder="א ב ג ד ה..."
              dir="rtl"
              className="bg-zinc-950 border border-amber-500/25 rounded-xl py-3 px-4 text-sm text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 font-serif"
            />
          </div>
        </div>

        {/* Hebrew keyboard */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-amber-500/60 uppercase tracking-widest">Teclado Hebreo Virtual:</span>
          <div className="flex flex-wrap gap-1.5">
            {HEBREW_LETTERS.map(l => (
              <button
                key={l.letter}
                onClick={() => { setHebrewInput(prev => l.letter + prev); setInput(""); }}
                title={`${l.name} = ${l.value}`}
                className="w-10 h-10 bg-zinc-950 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 rounded-lg text-base text-amber-200 font-serif transition-all flex items-center justify-center"
              >
                {l.letter}
              </button>
            ))}
            <button
              onClick={() => { setHebrewInput(prev => prev.slice(0, -1)); }}
              className="px-3 h-10 bg-zinc-950 hover:bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 transition-all"
            >
              ← Del
            </button>
          </div>
          <div className="text-[10px] text-amber-500/40 flex flex-wrap gap-3">
            {HEBREW_LETTERS.map(l => (
              <span key={l.letter} className="font-mono">{l.letter}={l.value}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCalculate}
            className="flex-grow py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 flex items-center justify-center gap-2"
          >
            <Hash className="w-4 h-4" />
            Calcular Gematría
          </button>
          {(input || hebrewInput) && (
            <button
              onClick={() => { setInput(""); setHebrewInput(""); setResult(null); setAiResult(null); }}
              className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-400 hover:text-amber-200 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Numerical values */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-900 p-4 rounded-xl border border-amber-500/20 flex flex-col items-center gap-1 shadow-lg">
                <span className="text-3xl font-bold font-mono text-amber-400">{result.misparGadol}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Mispar Gadol</span>
                <span className="text-[9px] text-zinc-500">Valor Completo</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-purple-500/20 flex flex-col items-center gap-1 shadow-lg">
                <span className="text-3xl font-bold font-mono text-purple-400">{result.misparKatan}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">Mispar Katan</span>
                <span className="text-[9px] text-zinc-500">Raíz Digital</span>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-emerald-500/20 flex flex-col items-center gap-1 shadow-lg">
                <span className="text-3xl font-bold font-mono text-emerald-400">{result.misparSiduri}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Mispar Siduri</span>
                <span className="text-[9px] text-zinc-500">Valor Posicional</span>
              </div>
            </div>


            {/* Letter breakdown */}
            {result.breakdown.length > 0 && (
              <div className="bg-zinc-900/50 p-4 rounded-xl border border-amber-500/10">
                <div className="text-[10px] text-amber-500/60 uppercase tracking-widest mb-3">Desglose por Letra:</div>
                <div className="flex flex-wrap gap-2">
                  {result.breakdown.map((item: any, i: number) => (
                    <div key={i} className="bg-zinc-950 border border-amber-500/20 rounded-lg px-2 py-1.5 flex flex-col items-center min-w-[40px]">
                      <span className="text-sm font-bold text-amber-300 font-serif">{item.char}</span>
                      <span className="text-[10px] text-amber-500/70 font-mono">{item.value}</span>
                    </div>
                  ))}
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 flex flex-col items-center">
                    <span className="text-sm font-bold text-amber-400">=</span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">{result.misparGadol}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Famous equivalences */}
            {famousEq && (
              <div className="bg-gradient-to-r from-amber-500/5 to-purple-500/5 p-4 rounded-xl border border-amber-500/20">
                <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-2">✨ Equivalencias Sagradas del Número {result.misparGadol}:</div>
                {famousEq.map((eq, i) => (
                  <div key={i} className="text-xs text-amber-100/80 font-serif flex items-center gap-2">
                    <span className="text-amber-500">◆</span> {eq}
                  </div>
                ))}
              </div>
            )}

            {/* AI Interpretation button */}
            <button
              onClick={handleAIInterpret}
              disabled={aiLoading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-xs tracking-wider uppercase text-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              {aiLoading ? "Consultando el Arbol de la Vida..." : "Interpretar con IA Cabalística"}
              {!aiLoading && <ArrowRight className="w-4 h-4" />}
            </button>

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {error}</div>
            )}

            {/* AI Result */}
            {aiResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 p-5 rounded-xl border border-amber-500/20 flex flex-col gap-4 font-serif text-xs leading-relaxed"
              >
                <div className="text-[10px] text-amber-500/60 uppercase tracking-widest border-b border-amber-500/10 pb-2">⚜️ Interpretación Cabalística</div>
                {aiResult.significado_numerologico && (
                  <div>
                    <div className="text-amber-400 font-bold text-[10px] uppercase mb-1 font-sans">Significado Numerológico</div>
                    <p>{aiResult.significado_numerologico}</p>
                  </div>
                )}
                {aiResult.conexion_cabala && (
                  <div>
                    <div className="text-amber-400 font-bold text-[10px] uppercase mb-1 font-sans">🌳 Conexión con el Árbol</div>
                    <p>{aiResult.conexion_cabala}</p>
                  </div>
                )}
                {aiResult.equivalencias_hebreas && (
                  <div>
                    <div className="text-amber-400 font-bold text-[10px] uppercase mb-1 font-sans">✡️ Palabras Hebreas Equivalentes</div>
                    <p>{aiResult.equivalencias_hebreas}</p>
                  </div>
                )}
                {aiResult.practica && (
                  <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10">
                    <div className="text-amber-500 font-bold text-[10px] uppercase mb-1 font-sans">⚡ Práctica Contemplativa</div>
                    <p>{aiResult.practica}</p>
                  </div>
                )}
                {aiResult.paradoja && (
                  <div className="text-center italic text-amber-300 border-t border-amber-500/10 pt-3">
                    "{aiResult.paradoja}"
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
