import React, { useEffect, useState } from 'react';

export type FlashType = 'thanh-cong' | 'loi' | 'canh-bao' | 'thong-tin';

interface FlashMessageProps {
  message: string;
  type?: FlashType;
  duration?: number;
  onClose: () => void;
}

export function FlashMessage({ message, type = 'thanh-cong', duration = 3000, onClose }: FlashMessageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 400); // Wait for transition
    }, duration);

    return () => clearTimeout(hideTimer);
  }, [duration, onClose]);

  const icons = {
    'thanh-cong': '✅',
    'loi': '❌',
    'canh-bao': '⚠️',
    'thong-tin': 'ℹ️'
  };

  const borderColors = {
    'thanh-cong': 'border-l-green-600',
    'loi': 'border-l-red-600',
    'canh-bao': 'border-l-amber-600',
    'thong-tin': 'border-l-blue-600'
  };

  return (
    <div 
      className={`fixed top-6 left-1/2 -translate-x-1/2 min-w-[300px] max-w-[500px] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)] z-[9999] flex items-center gap-4 transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-medium border-l-[5px] ${borderColors[type]} ${isVisible ? 'translate-y-0' : '-translate-y-[100px]'}`}
    >
      <span className="text-xl">{icons[type] || 'ℹ️'}</span>
      <span className="text-slate-800 dark:text-slate-200">{message}</span>
    </div>
  );
}
