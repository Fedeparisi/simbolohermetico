import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const onClick = (evt: React.MouseEvent) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
    promptInstall.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar el Oráculo en su dispositivo');
      } else {
        console.log('El usuario declinó la instalación por ahora');
      }
    });
  };

  if (!supportsPWA) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors border border-yellow-500/30"
      title="Instalar como Aplicación"
    >
      <Download className="w-4 h-4" />
      <span>Instalar App</span>
    </button>
  );
}
