import React, { useEffect } from 'react';
import { RedeneerQuestion } from '../../generators/redeneer';

interface RedeneerTestProps {
  question: RedeneerQuestion;
  onAnswer: (answer: string) => void;
}

export const RedeneerTest: React.FC<RedeneerTestProps> = ({ question, onAnswer }) => {
  // Keyboard support 1, 2, 3
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (['1', '2', '3'].includes(key)) {
        const index = parseInt(key, 10) - 1;
        onAnswer(question.options[index]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, onAnswer]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto w-full animate-fade-in px-4 sm:px-0">
      <div className="bg-surface p-6 sm:p-10 rounded-2xl shadow-lg border border-surface-light w-full">
        
        <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12">
          {question.statements.map((stmt, idx) => (
            <div key={idx} className="bg-surface-light/50 px-4 sm:px-8 py-4 sm:py-6 rounded-xl border border-gray-800 text-center sm:text-left">
              <span className="text-lg sm:text-2xl font-bold tracking-wide text-gray-100">{stmt}</span>
            </div>
          ))}
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-3xl font-black uppercase text-military-500">{question.questionText}</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {question.options.map((opt, idx) => (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              className="flex-1 py-4 sm:py-6 bg-surface hover:bg-military-800 border-2 border-surface-light hover:border-military-500 rounded-xl text-lg sm:text-xl font-bold text-white transition-all hover:-translate-y-1 shadow-md group relative max-w-full"
            >
              <span className="absolute top-2 left-3 text-xs sm:text-sm text-gray-500 group-hover:text-military-400 font-mono">[{idx + 1}]</span>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
