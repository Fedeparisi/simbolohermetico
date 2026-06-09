import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { synthInstance } from "../utils/synth";

// Accurate moon phase calculation
function getMoonPhase(date: Date): { phase: number; name: string; emoji: string; illumination: number } {
  // Known new moon: Jan 6, 2000 18:14 UTC
  const known = new Date("2000-01-06T18:14:00Z");
  const synodic = 29.53058867; // days
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const phase = ((diff % synodic) + synodic) % synodic;
  const illumination = Math.round(50 * (1 - Math.cos((2 * Math.PI * phase) / synodic)));

  let name: string, emoji: string;
  if (phase < 1.85) { name = "Luna Nueva"; emoji = "🌑"; }
  else if (phase < 7.38) { name = "Luna Creciente"; emoji = "🌒"; }
  else if (phase < 9.22) { name = "Cuarto Creciente"; emoji = "🌓"; }
  else if (phase < 14.77) { name = "Gibosa Creciente"; emoji = "🌔"; }
  else if (phase < 16.62) { name = "Luna Llena"; emoji = "🌕"; }
  else if (phase < 22.15) { name = "Gibosa Menguante"; emoji = "🌖"; }
  else if (phase < 23.99) { name = "Cuarto Menguante"; emoji = "🌗"; }
  else { name = "Luna Menguante"; emoji = "🌘"; }

  return { phase, name, emoji, illumination };
}

const MoonPhaseSVG = ({ phase, className = "w-full h-full" }: { phase: number, className?: string }) => {
  const phaseNorm = (phase % 29.53058867) / 29.53058867;
  const isWaxing = phaseNorm <= 0.5;
  const p = isWaxing ? phaseNorm * 2 : (phaseNorm - 0.5) * 2;
  const rx = Math.max(0.01, 50 * Math.abs(1 - p * 2));
  const sweep = p >= 0.5 ? 1 : 0;

  const d = isWaxing
    ? `M 50 0 A 50 50 0 0 1 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`
    : `M 50 0 A 50 50 0 0 0 50 100 A ${rx} 50 0 0 ${sweep} 50 0 Z`;

  // Provide a unique ID for the clip path so multiple moons on screen don't collide
  const clipId = `lit-clip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg viewBox="-10 -10 120 120" className={className}>
      <defs>
        <radialGradient id="moon-glow" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Dark Unlit Moon */}
      <circle cx="50" cy="50" r="50" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
      
      {/* Subtle craters on dark side */}
      <circle cx="30" cy="40" r="6" fill="#27272a" />
      <circle cx="65" cy="35" r="10" fill="#27272a" />
      <circle cx="45" cy="70" r="8" fill="#27272a" />
      <circle cx="70" cy="65" r="5" fill="#27272a" />

      {/* Lit Phase */}
      <path d={d} fill="url(#moon-glow)" filter="url(#glow-filter)" />
      
      {/* Subtle craters on lit side */}
      <g clipPath={`url(#${clipId})`}>
        <clipPath id={clipId}>
          <path d={d} />
        </clipPath>
        <circle cx="30" cy="40" r="6" fill="#78350f" opacity="0.25" />
        <circle cx="65" cy="35" r="10" fill="#78350f" opacity="0.25" />
        <circle cx="45" cy="70" r="8" fill="#78350f" opacity="0.25" />
        <circle cx="70" cy="65" r="5" fill="#78350f" opacity="0.25" />
      </g>
    </svg>
  );
};

interface LunarDay {
  date: Date;
  phase: ReturnType<typeof getMoonPhase>;
  isToday: boolean;
}

function buildMonthDays(year: number, month: number): LunarDay[] {
  const today = new Date();
  const days: LunarDay[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    days.push({
      date,
      phase: getMoonPhase(date),
      isToday: date.toDateString() === today.toDateString()
    });
  }
  return days;
}

const PHASE_INFO: Record<string, { rituals: string[]; energy: string; color: string; planet: string; deity: string; incense: string; crystal: string }> = {
  "Luna Nueva": {
    energy: "Inicio, semillas, intenciones ocultas. El útero cósmico está en silencio.",
    rituals: ["Establecer nuevas intenciones por escrito", "Meditación de vacío y potencial", "Plantar semillas literales o metafóricas", "Consagrar nuevos proyectos mágicos"],
    color: "Negro y blanco", planet: "🌙 Luna / Saturno", deity: "Hécate, Kali, Nyx",
    incense: "Mirra, Ámbar negro", crystal: "Obsidiana, Onyx"
  },
  "Luna Creciente": {
    energy: "Acción, atracción, crecimiento. La luz aumenta, la voluntad se fortalece.",
    rituals: ["Hechizos de atracción y prosperidad", "Ejercicios de afirmación activa", "Comenzar nuevos proyectos", "Invocar energías de crecimiento"],
    color: "Verde y plateado", planet: "🌙 Luna / Venus", deity: "Artemisa, Ishtar creciente",
    incense: "Sándalo, Albahaca", crystal: "Aventurina verde, Jade"
  },
  "Cuarto Creciente": {
    energy: "Decisión, acción, superación de obstáculos. Momento de actuar con determinación.",
    rituals: ["Trabajos de fuerza y perseverancia", "Rituales de protección activa", "Confrontar desafíos"],
    color: "Rojo y plateado", planet: "🌙 Luna / Marte", deity: "Morrigan, Ares",
    incense: "Dragón de Sangre, Canela", crystal: "Cornalina, Granate"
  },
  "Gibosa Creciente": {
    energy: "Refinamiento, claridad, anticipación. La luz casi llena ilumina lo que falta perfeccionar.",
    rituals: ["Perfeccionar hechizos en progreso", "Rituales de claridad mental", "Trabajo con sueños lúcidos"],
    color: "Violeta y dorado", planet: "🌙 Luna / Júpiter", deity: "Atenea, Thoth",
    incense: "Lavanda, Benjuí", crystal: "Amatista, Lapislázuli"
  },
  "Luna Llena": {
    energy: "Plenitud, manifestación, poder máximo. La energía lunar alcanza su cénit sagrado.",
    rituals: ["Carga de cristales y agua lunar", "Rituales de manifestación máxima", "Adivinación y clarividencia", "Hechizos de amor y conexión", "Cargar herramientas mágicas"],
    color: "Blanco, plata y dorado", planet: "🌙 Luna (puro)", deity: "Selene, Isis, Diana",
    incense: "Jazmín, Rosa, Loto", crystal: "Selenita, Piedra de Luna, Cuarzo"
  },
  "Gibosa Menguante": {
    energy: "Gratitud, reflexión, comienzo de la liberación. Lo cosechado se transforma.",
    rituals: ["Gratitud y ofrendas", "Comenzar a soltar lo que ya no sirve", "Trabajo con sombra"],
    color: "Naranja y marrón", planet: "🌙 Luna / Saturno", deity: "Deméter, Oya",
    incense: "Incienso, Copal", crystal: "Citrino, Topacio"
  },
  "Cuarto Menguante": {
    energy: "Liberación, ruptura, deshacerse. Momento de cortar lazos y limpiar.",
    rituals: ["Rituales de destierro y limpieza", "Cortar vínculos tóxicos", "Limpiar el espacio sagrado", "Banishing (LBRP)"],
    color: "Azul oscuro y plateado", planet: "🌙 Luna / Mercurio", deity: "Hécate menguante, Morgana",
    incense: "Salvia, Eucalipto", crystal: "Aguamarina, Flourita"
  },
  "Luna Menguante": {
    energy: "Destierro, disolución, preparación para el nuevo ciclo. El gran silencio se acerca.",
    rituals: ["Meditación profunda y retiro", "Trabajos de deshacimiento final", "Purificación del cuerpo y mente", "Preparar intenciones para luna nueva"],
    color: "Gris y negro", planet: "🌙 Luna / Plutón", deity: "Lilith, Ereshkigal",
    incense: "Ciprés, Vetiver", crystal: "Turmalina negra, Labradorita"
  },
};

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

export function LunarView() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<LunarDay | null>(null);

  const days = useMemo(() => buildMonthDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const todayPhase = useMemo(() => getMoonPhase(today), []);
  const currentPhaseInfo = PHASE_INFO[todayPhase.name];

  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const selInfo = selectedDay ? PHASE_INFO[selectedDay.phase.name] : null;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    synthInstance.playChime(220, 0.5);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    synthInstance.playChime(330, 0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto flex flex-col gap-6"
    >
      {/* Today's Moon Card */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">🌙</div>
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Calendario Lunar Esotérico</h2>
            <p className="text-xs text-amber-100/60">Fases lunares y rituales correspondientes · Calculado astronómicamente</p>
          </div>
        </div>

        {/* Today highlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-zinc-950 rounded-xl border border-amber-500/20 p-5 flex flex-col items-center gap-3">
            <div className="w-32 h-32 drop-shadow-2xl">
              <MoonPhaseSVG phase={todayPhase.phase} />
            </div>
            <div className="text-center mt-2">
              <div className="text-base font-bold font-serif text-amber-400">{todayPhase.name}</div>
              <div className="text-xs text-amber-100/60">Hoy, {today.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}</div>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2">
              <div className="bg-gradient-to-r from-zinc-700 to-amber-400 h-2 rounded-full transition-all" style={{ width: `${todayPhase.illumination}%` }} />
            </div>
            <div className="text-[10px] text-amber-500/70">{todayPhase.illumination}% de iluminación</div>
          </div>

          {currentPhaseInfo && (
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="bg-zinc-950 rounded-xl border border-amber-500/10 p-4">
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-2">⚡ Energía del Momento</div>
                <p className="text-xs text-amber-100/80 font-serif leading-relaxed">{currentPhaseInfo.energy}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {[
                  { label: "🪐 Planeta", value: currentPhaseInfo.planet },
                  { label: "🌸 Color", value: currentPhaseInfo.color },
                  { label: "🌿 Incienso", value: currentPhaseInfo.incense },
                  { label: "💎 Cristal", value: currentPhaseInfo.crystal },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-zinc-950 rounded-lg border border-amber-500/10 px-3 py-2">
                    <div className="text-amber-500/70 uppercase tracking-wider mb-0.5">{label}</div>
                    <div className="text-amber-100/80">{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-950 rounded-xl border border-amber-500/10 p-4">
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-2">🛡️ Rituales Recomendados</div>
                <ul className="flex flex-col gap-1">
                  {currentPhaseInfo.rituals.map((r, i) => (
                    <li key={i} className="text-xs text-amber-100/70 flex items-start gap-1.5 font-serif">
                      <span className="text-amber-500 mt-0.5">◆</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-zinc-900/40 rounded-2xl border border-amber-500/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg border border-amber-500/20 hover:bg-amber-500/10 text-amber-400 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-bold font-serif text-amber-400">{MONTHS_ES[viewMonth]} {viewYear}</div>
          <button onClick={nextMonth} className="p-2 rounded-lg border border-amber-500/20 hover:bg-amber-500/10 text-amber-400 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_ES.map(d => (
            <div key={d} className="text-[9px] text-amber-500/50 uppercase tracking-wider text-center py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for first day of month */}
          {Array.from({ length: firstDow }).map((_, i) => <div key={`e-${i}`} />)}

          {days.map(day => (
            <button
              key={day.date.toISOString()}
              onClick={() => { setSelectedDay(day); synthInstance.playChime(330, 0.4); }}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 border transition-all text-[9px] ${
                day.isToday
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-300 font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                  : selectedDay?.date.toDateString() === day.date.toDateString()
                    ? "border-purple-500/40 bg-purple-500/10 text-purple-300"
                    : "border-transparent hover:border-amber-500/20 hover:bg-amber-500/5 text-zinc-400"
              }`}
            >
              <div className="w-8 h-8 sm:w-12 sm:h-12 drop-shadow-md">
                <MoonPhaseSVG phase={day.phase.phase} />
              </div>
              <span className="text-[9px]">{day.date.getDate()}</span>
            </button>
          ))}
        </div>

        {/* Phase legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-amber-500/10 items-center justify-center">
          {[
            { phase: 0, label: "Nueva" },
            { phase: 3.69, label: "Creciente" },
            { phase: 7.38, label: "Cuarto +" },
            { phase: 11.07, label: "Gibosa +" },
            { phase: 14.76, label: "Llena" },
            { phase: 18.45, label: "Gibosa -" },
            { phase: 22.15, label: "Cuarto -" },
            { phase: 25.84, label: "Menguante" }
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5 opacity-60">
              <div className="w-6 h-6"><MoonPhaseSVG phase={s.phase} /></div>
              <span className="text-[9px] text-zinc-300">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDay && selInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 rounded-2xl border border-purple-500/20 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 drop-shadow-xl">
                  <MoonPhaseSVG phase={selectedDay.phase.phase} />
                </div>
                <div>
                  <div className="text-sm font-bold font-serif text-amber-400">{selectedDay.phase.name}</div>
                  <div className="text-xs text-zinc-500">
                    {selectedDay.date.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    {" · "}{selectedDay.phase.illumination}% iluminada
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-zinc-600 hover:text-amber-400">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <div className="bg-zinc-950 rounded-xl p-4 border border-amber-500/10">
                  <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-2">⚡ Energía</div>
                  <p className="text-xs text-amber-100/80 font-serif leading-relaxed">{selInfo.energy}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-zinc-950 rounded-lg border border-amber-500/10 px-3 py-2">
                    <div className="text-amber-500/70">Deidad</div>
                    <div className="text-amber-100/80">{selInfo.deity}</div>
                  </div>
                  <div className="bg-zinc-950 rounded-lg border border-amber-500/10 px-3 py-2">
                    <div className="text-amber-500/70">Planeta</div>
                    <div className="text-amber-100/80">{selInfo.planet}</div>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950 rounded-xl p-4 border border-amber-500/10">
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-2">🛡️ Rituales</div>
                <ul className="flex flex-col gap-1.5">
                  {selInfo.rituals.map((r, i) => (
                    <li key={i} className="text-xs text-amber-100/70 flex items-start gap-1.5 font-serif">
                      <span className="text-amber-500 mt-0.5">◆</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
