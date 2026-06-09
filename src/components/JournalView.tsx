import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookMarked, Save, Plus, Trash2, Calendar } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  category: 'sueños' | 'rituales' | 'tarot' | 'meditación' | 'general';
}

export function JournalView() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hermetic-journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing journal', e);
      }
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('hermetic-journal', JSON.stringify(newEntries));
  };

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: 'Nueva entrada...',
      content: '',
      category: 'general',
    };
    setSelectedEntry(newEntry);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedEntry) return;
    const exists = entries.find(e => e.id === selectedEntry.id);
    let newEntries;
    if (exists) {
      newEntries = entries.map(e => (e.id === selectedEntry.id ? selectedEntry : e));
    } else {
      newEntries = [selectedEntry, ...entries];
    }
    saveEntries(newEntries);
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Destruir este pergamino?')) return;
    const newEntries = entries.filter(e => e.id !== id);
    saveEntries(newEntries);
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
      setIsEditing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6">
      {/* Sidebar for Entries */}
      <div className="w-full md:w-1/3 bg-zinc-900/50 rounded-2xl border border-amber-500/20 shadow-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-amber-500/10 flex justify-between items-center bg-zinc-900">
          <div className="flex items-center gap-2 text-amber-400">
            <BookMarked className="w-5 h-5" />
            <h2 className="font-bold font-serif uppercase tracking-widest text-sm">Bitácora</h2>
          </div>
          <button onClick={handleNewEntry} className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500 hover:text-zinc-950 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {entries.length === 0 && (
            <div className="text-center p-8 text-zinc-500 text-xs italic">El libro está en blanco...</div>
          )}
          {entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => { setSelectedEntry(entry); setIsEditing(false); }}
              className={`p-3 rounded-xl cursor-pointer border transition-all ${
                selectedEntry?.id === entry.id
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800/50 hover:border-amber-500/20 hover:bg-zinc-900'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-amber-100 text-xs font-semibold truncate pr-2">{entry.title}</h3>
                <span className="text-[9px] text-amber-500/60 uppercase px-1.5 py-0.5 bg-amber-500/5 rounded shrink-0">{entry.category}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <Calendar className="w-3 h-3" />
                <span>{entry.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-amber-500/10 shadow-xl overflow-hidden flex flex-col">
        {selectedEntry ? (
          <>
            <div className="p-4 border-b border-amber-500/10 bg-zinc-900/50 flex flex-wrap gap-3 items-center justify-between">
              {isEditing ? (
                <input
                  type="text"
                  value={selectedEntry.title}
                  onChange={e => setSelectedEntry({ ...selectedEntry, title: e.target.value })}
                  className="bg-zinc-950 border border-amber-500/30 text-amber-100 text-sm font-serif px-3 py-1.5 rounded-lg focus:outline-none focus:border-amber-400 flex-1 min-w-[200px]"
                />
              ) : (
                <h2 className="text-lg font-serif text-amber-300 flex-1">{selectedEntry.title}</h2>
              )}

              <div className="flex gap-2 items-center">
                {isEditing ? (
                  <select
                    value={selectedEntry.category}
                    onChange={e => setSelectedEntry({ ...selectedEntry, category: e.target.value as any })}
                    className="bg-zinc-950 border border-amber-500/30 text-amber-400 text-xs px-2 py-1.5 rounded-lg focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="sueños">Sueños</option>
                    <option value="rituales">Rituales</option>
                    <option value="tarot">Tarot</option>
                    <option value="meditación">Meditación</option>
                  </select>
                ) : (
                  <span className="text-xs text-amber-500/70 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded-md">{selectedEntry.category}</span>
                )}

                {isEditing ? (
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-zinc-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors">
                    <Save className="w-4 h-4" /> Guardar
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-500/10 transition-colors">
                    Editar
                  </button>
                )}
                
                <button onClick={() => handleDelete(selectedEntry.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Eliminar pergamino">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {isEditing ? (
                <textarea
                  value={selectedEntry.content}
                  onChange={e => setSelectedEntry({ ...selectedEntry, content: e.target.value })}
                  placeholder="Inscribe tus revelaciones aquí..."
                  className="w-full h-full min-h-[300px] bg-transparent resize-none text-sm text-amber-100/90 font-serif leading-relaxed focus:outline-none placeholder-zinc-700"
                />
              ) : (
                <div className="text-sm text-amber-100/90 font-serif leading-relaxed whitespace-pre-wrap">
                  {selectedEntry.content || <span className="text-zinc-600 italic">Pergamino vacío...</span>}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
            <BookMarked className="w-16 h-16 text-amber-500/10 mb-4" />
            <p className="text-sm max-w-sm">Abre tu mente y registra tus experiencias espirituales. Selecciona una entrada o crea una nueva.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
