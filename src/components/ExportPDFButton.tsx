import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportElementToPDF } from '../utils/pdfExport';

interface ExportPDFButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
  label?: string;
}

export function ExportPDFButton({ 
  targetId, 
  filename = 'Hermetico_Export.pdf',
  className = "flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-zinc-900 border border-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/10 hover:border-amber-500/40 transition-colors",
  label = "Exportar PDF"
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportElementToPDF(targetId, filename);
    } catch (e) {
      console.error(e);
      alert("Hubo un error al exportar. Inténtalo de nuevo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={isExporting}
      className={className}
      title="Exportar como documento PDF"
    >
      {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      <span>{isExporting ? "Procesando..." : label}</span>
    </button>
  );
}
