import React, { useState, useEffect } from 'react';
import { GetalQuestion, Expression } from '../../generators/getal';

interface GetalTestProps {
  question: GetalQuestion;
  onAnswer: (answer: 'B' | 'O' | 'G') => void;
}

const ExpressionDisplay: React.FC<{ expr: Expression }> = ({ expr }) => (
  <div className="text-5xl sm:text-6xl font-mono text-center tracking-widest text-white">
    {expr.left} {expr.operator} {expr.right}
  </div>
);

export const GetalTest: React.FC<GetalTestProps> = ({ question, onAnswer }) => {
  const [screen, setScreen] = useState<1 | 2 | 3>(1);

  // Keyboard support for answering on screen 3
  useEffect(() => {
    if (screen !== 3) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['B', 'O', 'G'].includes(key)) {
        onAnswer(key as 'B' | 'O' | 'G');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, onAnswer]);

  // Reset screen when question changes
  useEffect(() => {
    setScreen(1);
  }, [question]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-12 max-w-2xl mx-auto w-full">
      {screen === 1 && (
        <div className="flex flex-col items-center gap-8 w-full animate-fade-in px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-military-500 mb-4 sm:mb-8 text-center">Bovenste Lijn</h2>
          <div className="bg-surface p-8 sm:p-12 rounded-xl shadow-inner border border-surface-light w-full">
            <ExpressionDisplay expr={question.topExpression} />
          </div>
          <button 
            onClick={() => setScreen(2)}
            className="mt-8 px-12 py-4 bg-military-700 hover:bg-military-600 font-bold tracking-widest uppercase text-white rounded transition-colors"
          >
            Volgende &rarr;
          </button>
        </div>
      )}

      {screen === 2 && (
        <div className="flex flex-col items-center gap-8 w-full animate-fade-in px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-military-500 mb-4 sm:mb-8 text-center">Onderste Lijn</h2>
          <div className="bg-surface p-8 sm:p-12 rounded-xl shadow-inner border border-surface-light w-full">
            <ExpressionDisplay expr={question.bottomExpression} />
          </div>
          <button 
            onClick={() => setScreen(3)}
            className="mt-8 px-12 py-4 bg-military-700 hover:bg-military-600 font-bold tracking-widest uppercase text-white rounded transition-colors"
          >
            Volgende &rarr;
          </button>
        </div>
      )}
      {screen === 3 && (
        <div className="flex flex-col items-center gap-6 sm:gap-8 w-full animate-fade-in px-4 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-military-500 mb-4 sm:mb-8 text-center">Maak uw keuze</h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full mt-2 sm:mt-4 justify-center">
            {[
              { id: 'B', label: 'Bovenste is groter' },
              { id: 'O', label: 'Onderste is groter' },
              { id: 'G', label: 'Gelijk' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => onAnswer(btn.id as 'B' | 'O' | 'G')}
                className="flex flex-row sm:flex-col items-center justify-center gap-4 p-4 sm:p-8 bg-surface hover:bg-military-800 border-2 border-surface-light hover:border-military-500 rounded-xl transition-all shadow group"
              >
                <span className="text-4xl sm:text-6xl font-black text-white group-hover:scale-110 transition-transform">{btn.id}</span>
                <span className="text-xs sm:text-sm font-semibold uppercase text-gray-400 group-hover:text-military-400 text-center">{btn.label}</span>
              </button>
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-4 text-center">
            Je kunt ook de toetsen <strong>B</strong>, <strong>O</strong>, of <strong>G</strong> gebruiken.
          </div>
        </div>
      )}
    </div>
  );
};
