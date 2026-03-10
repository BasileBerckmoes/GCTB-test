import React, { useState, useEffect } from 'react';
import { PlaatsQuestion, Cell, Arrow } from '../../generators/plaats';

interface PlaatsTestProps {
  question: PlaatsQuestion;
  onAnswer: (index: number) => void;
}

const SvgArrow: React.FC<{ arrow: Arrow }> = ({ arrow }) => {
  // isFilled = true means "Zwart" (black arrow), false means "Wit" (white arrow)
  const isFilled = arrow.color === 'Zwart';
  
  let rotation = 0;
  if (arrow.direction === 'Rechts Op') rotation = 45;
  if (arrow.direction === 'Rechts Neer') rotation = 135;
  if (arrow.direction === 'Links Neer') rotation = 225;
  if (arrow.direction === 'Links Op') rotation = 315;

  return (
    <svg 
      className="w-8 h-8 sm:w-12 sm:h-12 transition-transform drop-shadow-md"
      style={{ transform: `rotate(${rotation}deg)` }}
      viewBox="0 0 24 24" 
      fill={isFilled ? '#111827' : '#F9FAFB'}
      stroke={isFilled ? '#9CA3AF' : '#F9FAFB'} 
      strokeWidth="1.5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4 11h5v11h6V11h5L12 2z" />
    </svg>
  );
};

export const PlaatsTest: React.FC<PlaatsTestProps> = ({ question, onAnswer }) => {
  const [screen, setScreen] = useState<1 | 2>(1);

  useEffect(() => {
    setScreen(1);
  }, [question]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto w-full">
      
      {screen === 1 && (
        <div className="flex flex-col items-center gap-12 w-full animate-fade-in">
          <div className="text-center">
             <h2 className="text-2xl font-bold uppercase tracking-widest text-military-500 mb-2">Memoreer de Regels</h2>
             <p className="text-gray-400">Zoek straks de cel die aan BEIDE regels voldoet.</p>
          </div>
          
          <div className="flex flex-col gap-6 w-full max-w-lg">
            {question.rulesText.map((rule, idx) => (
              <div key={idx} className="bg-surface py-8 px-6 rounded-xl border-l-4 border-military-500 shadow-md text-center">
                <span className="text-2xl font-bold text-white tracking-wide">{rule}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setScreen(2)}
            className="mt-8 px-8 sm:px-12 py-4 bg-military-700 hover:bg-military-600 font-bold tracking-widest uppercase text-white rounded transition-colors shadow-lg w-full sm:w-auto"
          >
            Volgende &rarr;
          </button>
        </div>
      )}

      {screen === 2 && (
        <div className="flex flex-col items-center w-full animate-fade-in">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-military-500 mb-8">Selecteer het juiste vak</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 w-full">
            {question.grid.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(idx)}
                className="bg-surface hover:bg-surface-light border-2 border-surface-light hover:border-military-500 rounded-xl p-4 sm:p-8 flex flex-col items-center justify-center gap-3 sm:gap-6 transition-all shadow hover:shadow-military-500/20 aspect-[3/4]"
              >
                <div className="flex flex-col items-center gap-4 sm:gap-8">
                  <div className="relative">
                    <span className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-gray-600 uppercase">Top</span>
                    <SvgArrow arrow={cell.top} />
                  </div>
                  <div className="w-12 sm:w-16 h-px bg-gray-700 my-1 sm:my-2"></div>
                  <div className="relative">
                    <span className="absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 text-[10px] sm:text-xs font-bold text-gray-600 uppercase">Bot</span>
                    <SvgArrow arrow={cell.bottom} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
