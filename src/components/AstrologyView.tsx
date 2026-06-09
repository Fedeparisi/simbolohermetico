import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MapPin, Loader2, X, CheckCircle2 } from "lucide-react";
import { synthInstance } from "../utils/synth";
import { safeFetchJSON } from "../utils/api";

// ─── Astronomical calculations (VSOP87 simplified) ──────────────────────────
function julianDay(date: Date): number {
  const Y = date.getUTCFullYear(), M = date.getUTCMonth() + 1, D = date.getUTCDate();
  const A = Math.floor((14 - M) / 12);
  const y = Y + 4800 - A;
  const m = M + 12 * A - 3;
  return D + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function obliquity(T: number): number {
  return 23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;
}

function norm360(a: number): number { return ((a % 360) + 360) % 360; }

const SIGNS = ["Aries","Tauro","Géminis","Cáncer","Leo","Virgo","Libra","Escorpio","Sagitario","Capricornio","Acuario","Piscis"];
const SIGN_EMOJIS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

function getSign(lon: number) {
  const n = norm360(lon);
  const idx = Math.floor(n / 30);
  const deg = n - idx * 30;
  return { sign: SIGNS[idx], emoji: SIGN_EMOJIS[idx], degree: Math.floor(deg), minutes: Math.floor((deg % 1) * 60) };
}

interface Planet { name: string; emoji: string; lon: number; retro?: boolean }

function getPlanetaryPositions(date: Date): Planet[] {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const planets = [
    { name: "Sol",      emoji: "☉", L: 280.46646 + 36000.76983 * T,  period: 365.25   },
    { name: "Luna",     emoji: "☽", L: 218.3165  + 481267.8813 * T,  period: 29.53    },
    { name: "Mercurio", emoji: "☿", L: 252.2509  + 149474.0722 * T,  period: 87.97    },
    { name: "Venus",    emoji: "♀", L: 181.9798  + 58517.8160 * T,   period: 224.7    },
    { name: "Marte",    emoji: "♂", L: 355.4333  + 19141.2964 * T,   period: 686.97   },
    { name: "Júpiter",  emoji: "♃", L: 34.3515   + 3034.9057 * T,    period: 4332.59  },
    { name: "Saturno",  emoji: "♄", L: 50.0774   + 1222.1138 * T,    period: 10759.2  },
    { name: "Urano",    emoji: "♅", L: 314.0550  + 428.4882 * T,     period: 30688.5  },
    { name: "Neptuno",  emoji: "♆", L: 304.3487  + 218.4862 * T,     period: 60182    },
    { name: "Plutón",   emoji: "♇", L: 238.9508  + 145.2086 * T,     period: 90465    },
  ];
  const dayNum = JD - 2451545;
  return planets.map(p => ({
    name: p.name, emoji: p.emoji,
    lon: norm360(p.L),
    retro: p.name !== "Sol" && p.name !== "Luna"
      ? Math.sin((dayNum / p.period) * Math.PI * 2) < -0.8
      : false,
  }));
}

function getAscendant(date: Date, lat: number, lon: number): number {
  const JD = julianDay(date);
  const T = (JD - 2451545.0) / 36525;
  const GMST = 280.46061837 + 360.98564736629 * (JD - 2451545) + 0.000387933 * T * T;
  const LMST = norm360(GMST + lon);
  const eps = obliquity(T);
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const AscRad = Math.atan2(
    Math.cos(LMST * Math.PI / 180),
    -Math.sin(LMST * Math.PI / 180) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad)
  );
  return norm360(AscRad * 180 / Math.PI);
}

function getHouses(ascDeg: number): number[] {
  return Array.from({ length: 12 }, (_, i) => norm360(ascDeg + i * 30));
}

const PLANET_MEANINGS: Record<string, { hermetic: string }> = {
  "Sol":      { hermetic: "Tiphereth — El corazón del Árbol de la Vida, el Cristo interior" },
  "Luna":     { hermetic: "Yesod — El espejo astral, los sueños y el subconsciente" },
  "Mercurio": { hermetic: "Hod — El mensajero divino, Hermes Trismegisto" },
  "Venus":    { hermetic: "Netzaj — El deseo y el arte, Afrodita cósmica" },
  "Marte":    { hermetic: "Geburah — La fuerza purificadora, el guerrero espiritual" },
  "Júpiter":  { hermetic: "Jesed — La gracia divina, la abundancia del Creador" },
  "Saturno":  { hermetic: "Binah — La Gran Madre cósmica, el principio de forma" },
  "Urano":    { hermetic: "Chokmah — El poder de la chispa inicial, la voluntad primordial" },
  "Neptuno":  { hermetic: "Kether — La disolución en el Todo, el velo entre mundos" },
  "Plutón":   { hermetic: "Daath — El abismo entre los mundos, la transmutación total" },
};

function getHouseTheme(h: number): string {
  return ["Personalidad y apariencia","Dinero y posesiones","Comunicación y hermanos","Hogar y familia","Creatividad y romance","Salud y trabajo","Relaciones y matrimonio","Sexo, muerte y herencias","Filosofía y espiritualidad","Carrera y reputación","Amistades y sociedad","Karma y espiritualidad"][h - 1] || "";
}

// ─── Geocoding types ──────────────────────────────────────────────────────────
interface GeoSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: { city?: string; town?: string; village?: string; country?: string };
}

interface SelectedCity {
  name: string;
  lat: number;
  lon: number;
  tzOffset: number;
  tzName: string;
}

// ─── City Search Component ────────────────────────────────────────────────────
function CitySearchInput({
  value,
  selectedCity,
  onSelect,
  onClear,
}: {
  value: string;
  selectedCity: SelectedCity | null;
  onSelect: (city: SelectedCity) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [tzLoading, setTzLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback((q: string) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    setError("");
    // Nominatim OpenStreetMap — free, no API key
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1&featuretype=city`,
      { headers: { "Accept-Language": "es,en", "User-Agent": "HermeticoApp/2.0" } }
    )
      .then(r => r.json())
      .then((data: GeoSuggestion[]) => {
        setSuggestions(data);
        setOpen(data.length > 0);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo conectar al servicio de geocodificación");
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (selectedCity) onClear();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(q), 400);
  };

  const handleSelect = async (s: GeoSuggestion) => {
    const lat = parseFloat(s.lat);
    const lon = parseFloat(s.lon);
    // Shorten display name for UI
    const parts = s.display_name.split(", ");
    const shortName = parts.slice(0, 3).join(", ");
    setQuery(shortName);
    setSuggestions([]);
    setOpen(false);
    setTzLoading(true);
    setError("");
    try {
      // timeapi.io — free timezone lookup by coordinates, no API key
      const tzRes = await fetch(
        `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lon}`
      );
      const tzData = await tzRes.json();
      // tzData.currentUtcOffset.seconds / 3600
      const tzOffset = tzData?.currentUtcOffset?.seconds
        ? tzData.currentUtcOffset.seconds / 3600
        : 0;
      const tzName = tzData?.timeZone || "UTC";
      onSelect({ name: shortName, lat, lon, tzOffset, tzName });
    } catch {
      // Fallback: estimate UTC offset from longitude (rough but functional)
      const tzOffset = Math.round(lon / 15);
      onSelect({ name: shortName, lat, lon, tzOffset, tzName: `UTC${tzOffset >= 0 ? "+" : ""}${tzOffset}` });
      setError("Timezone aproximado por longitud (sin conexión al servicio)");
    } finally {
      setTzLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onClear();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500/50" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Ej: Rosario, Argentina..."
          className="w-full bg-zinc-950 border border-amber-500/25 rounded-xl py-2.5 pl-9 pr-9 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(loading || tzLoading) && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
          {selectedCity && !loading && !tzLoading && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          {query && (
            <button onClick={handleClear} className="text-zinc-500 hover:text-amber-400 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 top-full left-0 right-0 mt-1 bg-zinc-950 border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden"
          >
            {suggestions.map((s, i) => {
              const parts = s.display_name.split(", ");
              const city = parts[0];
              const country = parts[parts.length - 1];
              const region = parts.slice(1, -1).join(", ");
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-4 py-2.5 flex items-start gap-2.5 hover:bg-amber-500/10 border-b border-zinc-900 last:border-0 transition-all group"
                >
                  <MapPin className="w-3 h-3 text-amber-500/50 mt-0.5 shrink-0 group-hover:text-amber-400" />
                  <div className="min-w-0">
                    <div className="text-xs text-amber-200 font-semibold truncate">{city}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{region}{region ? " · " : ""}{country}</div>
                  </div>
                </button>
              );
            })}
            <div className="px-3 py-1.5 border-t border-zinc-900 flex items-center gap-1.5">
              <span className="text-[9px] text-zinc-600">Datos: © OpenStreetMap Nominatim</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected city info */}
      {selectedCity && (
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-emerald-500 font-mono">
            📍 {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°
          </span>
          <span className="text-[10px] text-amber-500/60 font-mono">
            🕐 {selectedCity.tzName} (UTC{selectedCity.tzOffset >= 0 ? "+" : ""}{selectedCity.tzOffset})
          </span>
        </div>
      )}

      {error && (
        <div className="mt-1 text-[10px] text-amber-400/70 flex items-center gap-1">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

// ─── Main AstrologyView ───────────────────────────────────────────────────────
export function AstrologyView() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");
  const [selectedCity, setSelectedCity] = useState<SelectedCity | null>(null);
  const [citySearchVal, setCitySearchVal] = useState("");
  const [chart, setChart] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInterpret, setAiInterpret] = useState<any>(null);
  const [error, setError] = useState("");

  const canGenerate = birthDate && selectedCity;

  const generateChart = () => {
    if (!canGenerate) return;
    synthInstance.playChime(440, 1.5, "sine");
    const [year, month, day] = birthDate.split("-").map(Number);
    const [hour, min] = birthTime.split(":").map(Number);
    // Convert local time → UTC using the real timezone offset
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour - selectedCity!.tzOffset, min));

    const planets = getPlanetaryPositions(utcDate);
    const ascDeg = getAscendant(utcDate, selectedCity!.lat, selectedCity!.lon);
    const ascSign = getSign(ascDeg);
    const houses = getHouses(ascDeg);

    const planetData = planets.map(p => {
      const sign = getSign(p.lon);
      let house = 1;
      for (let h = 0; h < 12; h++) {
        const start = houses[h];
        const end = houses[(h + 1) % 12];
        if (end < start) {
          if (p.lon >= start || p.lon < end) { house = h + 1; break; }
        } else {
          if (p.lon >= start && p.lon < end) { house = h + 1; break; }
        }
      }
      return { ...p, sign, house };
    });

    setChart({ planets: planetData, ascendant: ascSign, houses, city: selectedCity, birthDate, birthTime });
    setAiInterpret(null);
    setError("");
  };

  const handleAIInterpret = async () => {
    if (!chart) return;
    setAiLoading(true);
    setError("");
    synthInstance.playChime(370, 2.0, "triangle");
    try {
      const data = await safeFetchJSON("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planets: chart.planets.map((p: any) => ({
            name: p.name, sign: p.sign.sign, house: p.house, retro: p.retro
          })),
          ascendant: chart.ascendant.sign,
          birthDate: chart.birthDate,
          city: chart.city.name
        })
      }, "Los astros guardan silencio en este instante.");
      setAiInterpret(data);
      synthInstance.playChime(523, 2.5, "sine");
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
      {/* Birth data form */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">📊</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Astrología Predictiva — Carta Natal Completa</h2>
            <p className="text-xs text-amber-100/60">10 planetas · 12 casas · Ascendente · Coordenadas exactas · Timezone real</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Fecha de Nacimiento:</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="bg-zinc-950 border border-amber-500/25 rounded-xl py-2.5 px-4 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Hora de Nacimiento:</label>
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="bg-zinc-950 border border-amber-500/25 rounded-xl py-2.5 px-4 text-xs text-amber-100 focus:outline-none focus:border-amber-400 transition-all"
            />
            <p className="text-[10px] text-zinc-600">Si no la sabrés, dejá 12:00</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Ciudad de Nacimiento:</label>
            <CitySearchInput
              value={citySearchVal}
              selectedCity={selectedCity}
              onSelect={city => { setSelectedCity(city); setCitySearchVal(city.name); }}
              onClear={() => { setSelectedCity(null); setCitySearchVal(""); }}
            />
          </div>
        </div>

        {/* Validation hint */}
        {!selectedCity && (
          <div className="flex items-center gap-2 text-[10px] text-amber-500/50 bg-amber-500/5 rounded-lg p-3 border border-amber-500/10">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>Escribí al menos 2 letras de tu ciudad para ver sugerencias con coordenadas exactas</span>
          </div>
        )}

        <button
          onClick={generateChart}
          disabled={!canGenerate}
          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed font-bold rounded-xl text-xs tracking-widest uppercase text-zinc-950 transition-all border border-amber-400 disabled:border-zinc-700 flex items-center justify-center gap-2"
        >
          ✨ {!canGenerate && !birthDate ? "Completa fecha y ciudad" : !canGenerate ? "Seleccioná una ciudad del listado" : "Calcular Carta Natal"}
        </button>
      </div>

      {/* Chart display */}
      <AnimatePresence>
        {chart && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">

            {/* City + timezone badge */}
            <div className="flex items-center gap-3 flex-wrap text-[10px] text-amber-100/50 bg-zinc-900/40 rounded-xl px-4 py-2.5 border border-amber-500/10">
              <span className="text-amber-500">📍</span>
              <span className="font-semibold text-amber-300">{chart.city.name}</span>
              <span className="text-zinc-600">|</span>
              <span className="font-mono">{chart.city.lat.toFixed(4)}°N, {chart.city.lon.toFixed(4)}°E</span>
              <span className="text-zinc-600">|</span>
              <span className="font-mono">{chart.city.tzName}</span>
            </div>

            {/* Ascendant highlight */}
            <div className="bg-gradient-to-r from-amber-500/10 to-purple-500/10 p-4 rounded-xl border border-amber-500/30 flex items-center gap-4">
              <span className="text-4xl">{chart.ascendant.emoji}</span>
              <div>
                <div className="text-[10px] text-amber-500/60 uppercase tracking-widest">Ascendente (Máscara del Alma)</div>
                <div className="text-lg font-bold font-serif text-amber-400">{chart.ascendant.sign} {chart.ascendant.degree}°{chart.ascendant.minutes}'</div>
                <div className="text-xs text-amber-100/60">Cómo te presentás al mundo · Cúspide de Casa 1</div>
              </div>
            </div>

            {/* Planet table */}
            <div className="bg-zinc-900/40 rounded-2xl border border-amber-500/10 overflow-hidden">
              <div className="text-[10px] text-amber-500/60 uppercase tracking-widest px-5 py-3 border-b border-amber-500/10">
                Los 10 Planetas — {new Date(chart.birthDate + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <div className="divide-y divide-amber-500/5">
                {chart.planets.map((p: any) => {
                  const meaning = PLANET_MEANINGS[p.name];
                  return (
                    <div key={p.name} className="px-5 py-3 flex items-center gap-4 hover:bg-amber-500/5 transition-all group">
                      <div className="w-8 text-xl text-center">{p.emoji}</div>
                      <div className="w-20 shrink-0">
                        <div className="text-xs font-bold text-amber-300">{p.name}</div>
                        {p.retro && <div className="text-[9px] text-red-400">℞ Retrógrado</div>}
                      </div>
                      <div className="w-32 shrink-0">
                        <div className="text-xs text-amber-100">{p.sign.emoji} {p.sign.sign}</div>
                        <div className="text-[10px] text-zinc-500">{p.sign.degree}°{p.sign.minutes}'</div>
                      </div>
                      <div className="w-20 shrink-0">
                        <div className="text-xs text-purple-300">Casa {p.house}</div>
                        <div className="text-[9px] text-zinc-600 truncate">{getHouseTheme(p.house).split(" y ")[0]}</div>
                      </div>
                      {meaning && (
                        <div className="flex-1 hidden md:block overflow-hidden">
                          <div className="text-[10px] text-zinc-600 leading-tight group-hover:text-amber-100/50 transition-all truncate">{meaning.hermetic}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Houses grid */}
            <div className="bg-zinc-900/40 rounded-2xl border border-amber-500/10 p-5">
              <div className="text-[10px] text-amber-500/60 uppercase tracking-widest mb-3">Las 12 Casas Astrológicas</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const sign = getSign(chart.houses[i]);
                  const planetsInHouse = chart.planets.filter((p: any) => p.house === i + 1);
                  return (
                    <div key={i} className="bg-zinc-950 rounded-xl border border-amber-500/10 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] text-amber-500/60 font-mono font-bold">H{i + 1}</span>
                        <span className="text-xs">{sign.emoji} {sign.sign}</span>
                      </div>
                      <div className="text-[9px] text-zinc-500 leading-tight mb-1">{getHouseTheme(i + 1)}</div>
                      {planetsInHouse.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {planetsInHouse.map((p: any) => (
                            <span key={p.name} title={p.name} className="text-sm bg-amber-500/10 rounded px-1 cursor-default">{p.emoji}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Interpretation */}
            <button
              onClick={handleAIInterpret}
              disabled={aiLoading}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/20 hover:border-amber-500/40 rounded-xl text-xs tracking-wider uppercase text-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              {aiLoading ? "Los astros revelan su secreto..." : "Interpretación Hermética Completa con IA"}
            </button>

            {error && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-300">❌ {error}</div>}

            {aiInterpret && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl border border-amber-500/25 p-6 flex flex-col gap-5 font-serif text-xs leading-relaxed"
              >
                <div className="border-b border-amber-500/10 pb-3">
                  <div className="text-[10px] text-amber-500/60 uppercase tracking-widest">⚜️ Lectura Astral Hermética</div>
                </div>
                {aiInterpret.perfil_alma && (
                  <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/15">
                    <div className="text-amber-500 font-bold text-[10px] uppercase font-sans mb-2">🌟 Perfil del Alma</div>
                    <p>{aiInterpret.perfil_alma}</p>
                  </div>
                )}
                {aiInterpret.sol_luna_ascendente && (
                  <div><div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">☉☽↑ La Trinidad Fundamental</div><p>{aiInterpret.sol_luna_ascendente}</p></div>
                )}
                {aiInterpret.planetas_destacados && (
                  <div><div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">🪐 Planetas Dominantes</div><p>{aiInterpret.planetas_destacados}</p></div>
                )}
                {aiInterpret.mision_karmica && (
                  <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/15">
                    <div className="text-purple-400 font-bold text-[10px] uppercase font-sans mb-2">♾️ Misión Kármica</div>
                    <p>{aiInterpret.mision_karmica}</p>
                  </div>
                )}
                {aiInterpret.correspondencias_hermeticas && (
                  <div><div className="text-amber-400 font-bold text-[10px] uppercase font-sans mb-2">🌳 Correspondencias Herméticas</div><p>{aiInterpret.correspondencias_hermeticas}</p></div>
                )}
                {aiInterpret.decreto && (
                  <div className="text-center italic text-amber-300 border-t border-amber-500/10 pt-4">
                    "{aiInterpret.decreto}"
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
