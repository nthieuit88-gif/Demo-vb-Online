import React, { useEffect, useState } from 'react';
import { applyTheme, getInitialTheme } from '../utils/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'sang' | 'toi'>(getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'toi' ? 'sang' : 'toi');
  };

  return (
    <button 
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-[200] bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm font-semibold cursor-pointer shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:scale-105 text-slate-800 dark:text-slate-200"
      aria-label="Đổi chủ đề sáng/tối"
    >
      {theme === 'toi' ? '☀️ Sáng' : '🌙 Tối'}
    </button>
  );
}
