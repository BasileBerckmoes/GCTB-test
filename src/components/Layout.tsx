import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  headerTitle: string;
  onHomeClick?: () => void;
  showTimer?: boolean;
  elapsedMs?: number;
  progress?: { current: number; total: number };
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  headerTitle, 
  onHomeClick, 
  showTimer, 
  elapsedMs = 0,
  progress 
}) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col text-gray-100 font-sans">
      <header className="bg-surface flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3 shadow-md border-b border-military-800">
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-4">
          {onHomeClick && (
            <button 
              onClick={onHomeClick}
              className="text-military-400 hover:text-military-500 transition-colors font-semibold"
            >
              &larr; Start
            </button>
          )}
          <h1 className="text-lg sm:text-xl font-bold text-military-500 tracking-wide uppercase truncate">{headerTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
          {progress && (
            <div className="text-gray-300 text-sm sm:text-base font-medium bg-surface-light px-3 py-1 rounded-md">
              Vraag {progress.current} / {progress.total}
            </div>
          )}
          {showTimer && (
            <div className="text-lg sm:text-xl font-mono text-military-400 bg-surface-dark px-3 sm:px-4 py-1 rounded border border-military-800 shadow-inner">
              {formatTime(elapsedMs)}
            </div>
          )}
        </div>
      </header>

      {progress && (
        <div className="w-full h-1 bg-surface">
          <div 
            className="h-full bg-military-500 transition-all duration-300 ease-out"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}

      <main className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
