import React, { useEffect, useState } from 'react';
import { Moon, Sun, BookOpen } from 'lucide-react';

type Theme = 'dark' | 'light' | 'sepia';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('hermetic-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('theme-light', 'theme-sepia');
    if (newTheme !== 'dark') {
      document.documentElement.classList.add(`theme-${newTheme}`);
    }
    localStorage.setItem('hermetic-theme', newTheme);
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-yellow-500"
      title={`Cambiar Tema (Actual: ${theme})`}
    >
      {theme === 'dark' && <Moon className="w-5 h-5" />}
      {theme === 'light' && <Sun className="w-5 h-5" />}
      {theme === 'sepia' && <BookOpen className="w-5 h-5" />}
    </button>
  );
}
