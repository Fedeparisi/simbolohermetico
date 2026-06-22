import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Search, Download, ExternalLink, ChevronDown, BookMarked } from "lucide-react";
import { PDF_BOOKS_DATABASE, PDFBook } from "../utils/booksData";

export function PDFBooksView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const categories = ["all", ...Array.from(new Set(PDF_BOOKS_DATABASE.map(b => b.category)))];

  const filteredBooks = PDF_BOOKS_DATABASE.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      
      {/* Header section */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-xl flex flex-col gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-3 border-b border-amber-500/10 pb-4">
          <BookMarked className="w-6 h-6 text-amber-400" />
          <div>
            <h2 className="text-lg font-bold font-serif text-amber-400">Biblioteca PDF</h2>
            <p className="text-xs text-amber-100/60">Consulta y descarga los textos sagrados de la sabiduría iniciática.</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Buscar título o autor..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-amber-500/20 rounded-xl py-3 pl-4 pr-10 text-xs text-amber-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
          </div>
          
          <div className="relative md:w-64 z-20">
            <button 
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} 
              className="w-full flex items-center justify-between px-4 py-3 bg-zinc-950 border border-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold hover:bg-zinc-900 transition-all"
            >
              <span>{selectedCategory === "all" ? "Todas las Categorías" : selectedCategory}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {isCategoryMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} 
                  className="absolute top-full left-0 right-0 mt-1.5 bg-zinc-950 border border-amber-500/30 rounded-xl shadow-xl z-30 overflow-hidden"
                >
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => { setSelectedCategory(cat); setIsCategoryMenuOpen(false); }} 
                      className={`w-full px-4 py-3 text-left text-xs ${selectedCategory === cat ? "bg-amber-500/20 text-amber-300 border-l-2 border-amber-500" : "text-zinc-400 hover:bg-zinc-900"}`}
                    >
                      {cat === "all" ? "Todas las Categorías" : cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => (
            <motion.div 
              key={book.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-zinc-900/60 p-5 rounded-2xl border border-amber-500/15 flex flex-col justify-between shadow-lg hover:border-amber-500/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <span className="text-[9px] uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono mb-3 inline-block">
                  {book.category}
                </span>
                <h3 className="font-bold text-amber-400 font-serif text-base leading-tight mb-1">{book.title}</h3>
                <p className="text-[11px] text-amber-100/60 font-semibold mb-3 border-b border-amber-500/10 pb-3">{book.author}</p>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">{book.description}</p>
              </div>

              <div className="flex gap-2 relative z-10 mt-auto">
                <a 
                  href={book.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Leer
                </a>
                <a 
                  href={book.pdfUrl} 
                  download
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-lg shadow-amber-500/20"
                  title="Descargar PDF"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center border border-dashed border-amber-500/20 rounded-2xl bg-zinc-900/30">
          <BookMarked className="w-12 h-12 text-zinc-500/20 mb-3" />
          <p className="text-zinc-500 text-xs uppercase tracking-widest text-center">No se encontraron tomos<br/>que coincidan con tu búsqueda.</p>
        </div>
      )}

    </motion.div>
  );
}
