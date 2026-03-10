import React, { useEffect } from 'react';
import { FoutQuestion } from '../../generators/fout';

interface FoutTestProps {
  question: FoutQuestion;
  onAnswer: (count: number) => void;
}

export const FoutTest: React.FC<FoutTestProps> = ({ question, onAnswer }) => {
  // Keyboard support 0-4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (['0', '1', '2', '3', '4'].includes(key)) {
        onAnswer(parseInt(key, 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAnswer]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto w-full animate-fade-in">
      
      <div className="text-center mb-6 sm:mb-10 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-military-500 mb-2">Foutdetectietest</h2>
        <p className="text-gray-400 text-sm sm:text-base">Hoeveel tekens verschillen tussen de bovenste en onderste lijn?</p>
      </div>

      <div className="w-full flex flex-col gap-8 mb-16">
        <div className="flex flex-col items-center">
           <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 sm:mb-2">Eerste Lijn</span>
           <div className="bg-surface px-4 sm:px-8 py-4 sm:py-6 rounded-lg border border-surface-light w-full text-center shadow-inner">
             <span className="font-mono text-2xl sm:text-4xl text-gray-100 tracking-wide sm:tracking-widest break-all">
               {question.original}
             </span>
           </div>
        </div>
        
        <div className="flex flex-col items-center">
           <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 sm:mb-2">Tweede Lijn</span>
           <div className="bg-surface px-4 sm:px-8 py-4 sm:py-6 rounded-lg border border-surface-light w-full text-center shadow-inner">
             <span className="font-mono text-2xl sm:text-4xl text-white tracking-wide sm:tracking-widest break-all">
               {question.copy}
             </span>
           </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
        {[0, 1, 2, 3, 4].map(num => (
          <button
            key={num}
            onClick={() => onAnswer(num)}
            className="w-14 h-14 sm:w-24 sm:h-24 bg-surface hover:bg-military-800 border-2 border-surface-light hover:border-military-500 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white transition-all shadow-md hover:-translate-y-1 relative"
          >
            <span className="absolute top-1 left-2 text-[10px] sm:text-xs text-gray-600">[{num}]</span>
            {num}
          </button>
        ))}
      </div>

    </div>
  );
};
