import React, { useState, useEffect } from 'react';
import { WoordQuestion } from '../../generators/woord';

interface WoordTestProps {
  question: WoordQuestion;
  onAnswer: (count: number) => void;
}

export const WoordTest: React.FC<WoordTestProps> = ({ question, onAnswer }) => {
  const [screen, setScreen] = useState<1 | 2>(1);

  // Keyboard support for answering on screen 2
  useEffect(() => {
    if (screen !== 2) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (['0', '1', '2', '3'].includes(key)) {
        onAnswer(parseInt(key, 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, onAnswer]);

  useEffect(() => {
    setScreen(1);
  }, [question]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto w-full">
      
      {screen === 1 && (
        <div className="flex flex-col items-center gap-12 w-full animate-fade-in">
          <div className="text-center px-4 sm:px-0">
             <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-military-500 mb-2">Memoreer de Categorieën</h2>
             <p className="text-gray-400">Onthoud deze 3 categorieën in de juiste volgorde.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center px-4 sm:px-0">
            {question.rules.map((rule, idx) => (
              <div key={idx} className="flex-1 bg-surface py-6 sm:py-12 px-4 sm:px-6 rounded-xl border border-surface-light shadow-md text-center w-full sm:max-w-xs">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-wide">{rule}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setScreen(2)}
            className="mt-4 sm:mt-8 px-8 sm:px-12 py-4 bg-military-700 hover:bg-military-600 font-bold tracking-widest uppercase text-white rounded transition-colors shadow-lg w-[calc(100%-2rem)] sm:w-auto mx-4 sm:mx-0"
          >
            Volgende &rarr;
          </button>
        </div>
      )}

      {screen === 2 && (
        <div className="flex flex-col items-center gap-12 w-full animate-fade-in">
          <div className="text-center px-4 sm:px-0">
             <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-military-500 mb-2">Hoeveel woorden passen bij hun categorie?</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full justify-center px-4 sm:px-0">
            {question.words.map((word, idx) => (
              <div key={idx} className="flex-1 bg-surface-light py-6 sm:py-8 px-4 sm:px-6 rounded-xl border border-gray-700 shadow-inner text-center w-full sm:max-w-xs">
                <span className="text-xl sm:text-2xl font-bold text-gray-100 tracking-wide">{word}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-4 mt-6 sm:mt-8 justify-center px-4 sm:px-0 w-full sm:w-auto">
            {[0, 1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => onAnswer(num)}
                className="w-16 h-16 sm:w-24 sm:h-24 bg-surface hover:bg-military-800 border-2 border-surface-light hover:border-military-500 rounded-xl flex items-center justify-center text-3xl sm:text-4xl font-black text-white transition-all shadow-md hover:-translate-y-1"
              >
                {num}
              </button>
            ))}
          </div>
          
          <div className="text-xs sm:text-sm text-gray-500 text-center px-4 sm:px-0">
            (Je kunt ook de cijfertoetsen 0 t/m 3 op je toetsenbord gebruiken)
          </div>
        </div>
      )}

    </div>
  );
};
