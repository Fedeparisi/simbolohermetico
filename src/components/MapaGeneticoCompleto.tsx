import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map, BookOpen, ChevronLeft, Send, Compass } from 'lucide-react';
import { synthInstance } from '../utils/synth';
import { safeFetchJSON } from '../utils/api';
import { ExportPDFButton } from './ExportPDFButton';

const zodiacSigns: Record<string, any> = {
  '01-20_02-18': { sign: 'Acuario', element: 'Aire', arcano: 'El Loco (0)', sefirah: 'Malkuth → Yesoid', lessons: ['Innovación', 'Libertad', 'Comunidad'] },
  '02-19_03-20': { sign: 'Piscis', element: 'Agua', arcano: 'La Luna (XVIII)', sefirah: 'Yesoid', lessons: ['Intuición', 'Compasión', 'Trascendencia'] },
  '03-21_04-19': { sign: 'Aries', element: 'Fuego', arcano: 'El Emperador (IV)', sefirah: 'Geburah', lessons: ['Acción', 'Liderazgo', 'Conquista'] },
  '04-20_05-20': { sign: 'Tauro', element: 'Tierra', arcano: 'El Hierofante (V)', sefirah: 'Hod', lessons: ['Estabilidad', 'Valor', 'Naturaleza'] },
  '05-21_06-20': { sign: 'Géminis', element: 'Aire', arcano: 'Los Amantes (VI)', sefirah: 'Tiphereth', lessons: ['Comunicación', 'Dualidad', 'Síntesis'] },
  '06-21_07-22': { sign: 'Cáncer', element: 'Agua', arcano: 'El Carro (VII)', sefirah: 'Netzach', lessons: ['Emoción', 'Familia', 'Protección'] },
  '07-23_08-22': { sign: 'Leo', element: 'Fuego', arcano: 'La Fuerza (XI)', sefirah: 'Tiphereth', lessons: ['Creatividad', 'Orgullo', 'Voluntad'] },
  '08-23_09-22': { sign: 'Virgo', element: 'Tierra', arcano: 'El Ermitaño (IX)', sefirah: 'Hod', lessons: ['Purificación', 'Análisis', 'Servicio'] },
  '09-23_10-22': { sign: 'Libra', element: 'Aire', arcano: 'La Justicia (XI)', sefirah: 'Binah', lessons: ['Equilibrio', 'Justicia', 'Belleza'] },
  '10-23_11-21': { sign: 'Escorpio', element: 'Agua', arcano: 'La Muerte (XIII)', sefirah: 'Geburah', lessons: ['Transformación', 'Poder', 'Intensidad'] },
  '11-22_12-21': { sign: 'Sagitario', element: 'Fuego', arcano: 'La Templanza (XIV)', sefirah: 'Yesoid → Tiphereth', lessons: ['Expansión', 'Verdad', 'Filosofía'] },
  '12-22_01-19': { sign: 'Capricornio', element: 'Tierra', arcano: 'El Diablo (XV)', sefirah: 'Hod → Tiphereth', lessons: ['Estructura', 'Ambición', 'Disciplina'] }
};

const stages = [
  { name: 'El Mundo Ordinario', desc: 'La vida normal antes de la llamada.' },
  { name: 'La Llamada a la Aventura', desc: 'Recibes el mensaje de lo oculto.' },
  { name: 'Cruce del Umbral', desc: 'Atraviesas hacia el mundo espiritual.' },
  { name: 'Las Pruebas', desc: 'Encuentras aliados, enemigos y tentaciones.' },
  { name: 'La Caverna Profunda', desc: 'La prueba más oscura, enfrentando la sombra.' },
  { name: 'El Regreso', desc: 'Vuelves transformado, trayendo el elixir.' }
];

export function MapaGeneticoCompleto() {
  const [currentModule, setCurrentModule] = useState<'hub' | 'mapa' | 'historia' | 'monomito'>('hub');
  
  // Mapa State
  const [birthDate, setBirthDate] = useState('');
  const [mapData, setMapData] = useState<any>(null);
  
  // Historia State
  const [favoriteMovies, setFavoriteMovies] = useState('');
  const [favoriteBooks, setFavoriteBooks] = useState('');
  const [story, setStory] = useState('');
  const [loadingStory, setLoadingStory] = useState(false);
  const [storyError, setStoryError] = useState('');
  
  // Monomito State
  const [gameState, setGameState] = useState({ stage: 0, health: 100, wisdom: 0, power: 0 });
  const [sceneDetail, setSceneDetail] = useState('');
  const [loadingScene, setLoadingScene] = useState(false);
  const [sceneError, setSceneError] = useState('');

  const calculateMap = () => {
    if (!birthDate) return;
    const date = new Date(birthDate);
    const m = date.getMonth() + 1;
    const d = date.getDate();
    
    let matchedSign = null;
    for (const [range, data] of Object.entries(zodiacSigns)) {
      const [start, end] = range.split('_');
      const [sm, sd] = start.split('-').map(Number);
      const [em, ed] = end.split('-').map(Number);
      
      if ((m === sm && d >= sd) || (m === em && d <= ed)) {
        matchedSign = data;
        break;
      }
    }
    
    // Fallback for Capricorn crossing year boundary
    if (!matchedSign) matchedSign = zodiacSigns['12-22_01-19'];
    
    // Calculate Life Path Number (reduce birthdate digits)
    const digits = birthDate.replace(/\D/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, b) => Number(a) + Number(b), 0);
    }
    
    setMapData({
      zodiac: matchedSign,
      lifePath: sum,
      initiatoryPath: `Sendero de ${matchedSign.element}`
    });
    synthInstance.playChime(440, 1.0, 'triangle');
  };

  const handleGenerateStory = async () => {
    if (!favoriteMovies || !favoriteBooks) return;
    setLoadingStory(true);
    setStoryError('');
    setStory('');
    synthInstance.playChime(370, 1.5, "sine");
    try {
      const data = await safeFetchJSON("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movies: favoriteMovies, books: favoriteBooks })
      }, "Error al tejer tu destino");
      setStory(data.story);
      synthInstance.playChime(523.25, 2.0, "sine");
    } catch (e: any) {
      setStoryError(e.message);
    } finally {
      setLoadingStory(false);
    }
  };

  const sendPrompt = async (promptText: string) => {
    setLoadingScene(true);
    setSceneError('');
    setSceneDetail('');
    synthInstance.playChime(370, 1.5, "triangle");
    try {
      const data = await safeFetchJSON("/api/generate-monomyth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptText })
      }, "Error invocando la escena del monomito");
      setSceneDetail(data.scene);
      synthInstance.playChime(440, 2.0, "sine");
    } catch (e: any) {
      setSceneError(e.message);
    } finally {
      setLoadingScene(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[calc(100%-6mm)] mx-auto flex flex-col gap-6">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl">
        {currentModule !== 'hub' && (
          <button 
            onClick={() => setCurrentModule('hub')}
            className="mb-4 flex items-center gap-2 text-xs text-amber-500/60 hover:text-amber-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Volver al Hub
          </button>
        )}

        <AnimatePresence mode="wait">
          {currentModule === 'hub' && (
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="md:col-span-3 mb-4 text-center">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-pulse" />
                <h2 className="text-xl font-bold font-serif text-amber-400">Iniciación Personal</h2>
                <p className="text-xs text-amber-100/60 mt-2">Decodifica tu esencia espiritual y emprende el viaje del héroe.</p>
              </div>

              <button onClick={() => setCurrentModule('mapa')} className="p-6 bg-zinc-900 border border-amber-500/10 rounded-xl hover:border-amber-500/40 hover:bg-zinc-800 transition-all flex flex-col items-center gap-3 text-center group">
                <Map className="w-8 h-8 text-amber-500/60 group-hover:text-amber-400" />
                <h3 className="text-sm font-bold text-amber-200">Mapa Genético</h3>
                <p className="text-[10px] text-zinc-400">Descubre tu arcano regente y tus lecciones elementales.</p>
              </button>

              <button onClick={() => setCurrentModule('historia')} className="p-6 bg-zinc-900 border border-amber-500/10 rounded-xl hover:border-amber-500/40 hover:bg-zinc-800 transition-all flex flex-col items-center gap-3 text-center group">
                <BookOpen className="w-8 h-8 text-amber-500/60 group-hover:text-amber-400" />
                <h3 className="text-sm font-bold text-amber-200">Historia Personal</h3>
                <p className="text-[10px] text-zinc-400">Genera una novela iniciática basada en tus preferencias.</p>
              </button>

              <button onClick={() => setCurrentModule('monomito')} className="p-6 bg-zinc-900 border border-amber-500/10 rounded-xl hover:border-amber-500/40 hover:bg-zinc-800 transition-all flex flex-col items-center gap-3 text-center group">
                <Compass className="w-8 h-8 text-amber-500/60 group-hover:text-amber-400" />
                <h3 className="text-sm font-bold text-amber-200">El Monomito</h3>
                <p className="text-[10px] text-zinc-400">Juega y vive interactivamente tu viaje espiritual (RPG).</p>
              </button>
            </motion.div>
          )}

          {currentModule === 'mapa' && (
            <motion.div key="mapa" id="pdf-mapa-genetico" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="border-b border-amber-500/10 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold font-serif text-amber-400">Mapa Genético Esotérico</h2>
                  <p className="text-xs text-amber-100/60">Introduce tu fecha de nacimiento para calcular tus regencias estelares.</p>
                </div>
                {mapData && <ExportPDFButton targetId="pdf-mapa-genetico" filename="Mapa_Genetico_Hermetico.pdf" />}
              </div>
              <div className="flex gap-4">
                <input 
                  type="date" 
                  value={birthDate} 
                  onChange={e => setBirthDate(e.target.value)}
                  className="bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-4 text-sm text-amber-100 focus:border-amber-400 focus:outline-none"
                />
                <button 
                  onClick={calculateMap}
                  className="px-6 py-2 bg-amber-500 text-zinc-950 font-bold rounded-lg text-xs uppercase hover:bg-amber-400 transition-colors"
                >
                  Calcular
                </button>
              </div>

              {mapData && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-5 bg-zinc-950 rounded-xl border border-amber-500/20 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block mb-1">Signo Zodiacal</span>
                      <p className="text-sm text-amber-100">{mapData.zodiac.sign} ({mapData.zodiac.element})</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block mb-1">Sendero</span>
                      <p className="text-sm text-amber-100">{mapData.initiatoryPath}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block mb-1">Arcano Regente</span>
                      <p className="text-sm text-amber-100">{mapData.zodiac.arcano}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block mb-1">Sefirá Asociada</span>
                      <p className="text-sm text-amber-100">{mapData.zodiac.sefirah}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-4 border-t border-amber-500/10">
                    <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block mb-2">Lecciones a Integrar</span>
                    <div className="flex gap-2">
                      {mapData.zodiac.lessons.map((l: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[10px] text-amber-300">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {currentModule === 'historia' && (
            <motion.div key="historia" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="border-b border-amber-500/10 pb-4">
                <h2 className="text-lg font-bold font-serif text-amber-400">Historia Iniciática</h2>
                <p className="text-xs text-amber-100/60">El Oráculo tejerá tu novela personal de iniciación basada en tus arquetipos favoritos.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-amber-400 font-bold uppercase">Películas Favoritas:</label>
                  <input type="text" value={favoriteMovies} onChange={e => setFavoriteMovies(e.target.value)} placeholder="Ej: The Matrix, Interstellar..." className="bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-4 text-xs text-amber-100 focus:outline-none focus:border-amber-400" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-amber-400 font-bold uppercase">Libros Favoritos:</label>
                  <input type="text" value={favoriteBooks} onChange={e => setFavoriteBooks(e.target.value)} placeholder="Ej: Kybalion, El Señor de los Anillos..." className="bg-zinc-950 border border-amber-500/20 rounded-lg py-2 px-4 text-xs text-amber-100 focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <button 
                onClick={handleGenerateStory} 
                disabled={loadingStory || !favoriteMovies || !favoriteBooks}
                className="py-3 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs uppercase hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors"
              >
                {loadingStory ? "Tejiendo Destino..." : "Generar Novela Esotérica"}
              </button>

              {storyError && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">❌ {storyError}</div>}
              
              {story && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-5 bg-zinc-950 rounded-xl border border-amber-500/20 text-sm text-amber-100 font-serif leading-relaxed italic text-justify">
                  {story.split('\n').map((p, i) => p.trim() && <p key={i} className="mb-3">{p}</p>)}
                </motion.div>
              )}
            </motion.div>
          )}

          {currentModule === 'monomito' && (
            <motion.div key="monomito" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
              <div className="border-b border-amber-500/10 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold font-serif text-amber-400">El Monomito</h2>
                  <p className="text-xs text-amber-100/60">El Juego de la Iniciación</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-zinc-500 block">Salud</span>
                    <span className="text-emerald-400 font-mono font-bold">{gameState.health}%</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-zinc-500 block">Sabiduría</span>
                    <span className="text-amber-400 font-mono font-bold">{gameState.wisdom}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-zinc-500 block">Poder</span>
                    <span className="text-purple-400 font-mono font-bold">{gameState.power}</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 p-6 rounded-xl border border-amber-500/10 text-center">
                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">Etapa {gameState.stage + 1} de {stages.length}</span>
                <h3 className="text-2xl font-serif text-amber-300 mt-2">{stages[gameState.stage].name}</h3>
                <p className="text-sm text-amber-100/70 mt-2">{stages[gameState.stage].desc}</p>
                
                <div className="mt-8 flex justify-center gap-4">
                  {gameState.stage < stages.length - 1 ? (
                    <button 
                      onClick={() => { 
                        setGameState({ ...gameState, stage: gameState.stage + 1, wisdom: gameState.wisdom + 10, power: gameState.power + 5 }); 
                        setSceneDetail('');
                        synthInstance.playChime(440, 1.0, 'triangle');
                      }}
                      className="px-6 py-2.5 bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-zinc-950 font-bold rounded-lg text-xs transition-colors uppercase"
                    >
                      Avanzar en el Viaje
                    </button>
                  ) : (
                    <div className="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold rounded-lg text-xs uppercase">
                      Iniciación Completada
                    </div>
                  )}
                  
                  <button 
                    onClick={() => { 
                      sendPrompt(`Describes una escena épica del Monomito de Campbell para la etapa "${stages[gameState.stage].name}" de mi viaje iniciático. Mi clase mágica es ${mapData?.zodiac?.sign || 'Buscador'}. Mi sendero es ${mapData?.initiatoryPath || 'Senda Oculta'}. Crea un encuentro con un arquetipo o guía que me enseñe una lección.`); 
                    }}
                    disabled={loadingScene}
                    className="px-6 py-2.5 bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-400 hover:text-amber-300 disabled:opacity-50 font-bold rounded-lg text-xs transition-colors uppercase flex items-center gap-2"
                  >
                    {loadingScene ? "Invocando..." : "Ver Escena Detallada"} <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {sceneError && <div className="p-3 bg-red-950/20 border border-red-500/30 rounded-lg text-xs text-red-300">❌ {sceneError}</div>}
              
              {sceneDetail && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-zinc-900/50 rounded-xl border border-amber-500/20 text-sm text-amber-100 font-serif leading-relaxed italic text-justify shadow-inner">
                  {sceneDetail.split('\n').map((p, i) => p.trim() && <p key={i} className="mb-3">{p}</p>)}
                </motion.div>
              )}

              <div className="mt-4 text-center">
                <p className="text-[10px] text-zinc-500">🎮 Cómo jugar: Avanza a través de las 6 etapas del Monomito. Cada decisión aumenta tu Sabiduría y Poder. Cuando llegues al Regreso, habrás completado tu iniciación.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
