import React from 'react';
import { ScoreEntry } from '../types';

interface ResultsScreenProps {
  score: ScoreEntry;
  onHome: () => void;
  onViewScoreboard: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, onHome, onViewScoreboard }) => {
  const isFull = score.mode === 'full';
  
  const totalPct = Math.round((score.totalScore / score.totalMaxScore) * 100) || 0;
  
  let resultColor = 'text-red-500';
  let resultBg = 'bg-red-500/10 border-red-500/30';
  let resultText = 'GEZAKT';
  let resultMessage = 'Onvoldoende resultaat. Blijf trainen.';

  if (totalPct >= 80) {
    resultColor = 'text-green-500';
    resultBg = 'bg-green-500/10 border-green-500/30';
    resultText = 'GESLAAGD';
    resultMessage = 'Uitstekend! Je bent klaar voor de DOO.';
  } else if (totalPct >= 60) {
    resultColor = 'text-yellow-500';
    resultBg = 'bg-yellow-500/10 border-yellow-500/30';
    resultText = 'RANDGEVAL';
    resultMessage = 'Nipt. Probeer je snelheid of accuratesse nog iets te verhogen.';
  }

  const formatTime = (ms: number) => {
    const totalS = Math.floor(ms / 1000);
    const m = Math.floor(totalS / 60).toString().padStart(2, '0');
    const s = (totalS % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const tests = [
    { id: 'getalvaardigheid', name: 'Getalvaardigheidstest' },
    { id: 'plaatsbepaling', name: 'Plaatsbepalingstest' },
    { id: 'woordgeheugen', name: 'Woordgeheugentest' },
    { id: 'redeneer', name: 'Redeneertest' },
    { id: 'foutdetectie', name: 'Foutdetectietest' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pb-12">
      
      {/* Big Header Result */}
      <div className={`p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg border-2 ${resultBg}`}>
        <h2 className={`text-6xl font-black tracking-widest uppercase mb-4 ${resultColor}`}>
          {resultText}
        </h2>
        <div className="flex gap-12 items-end mb-6">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Eindscore</span>
            <span className="text-5xl font-mono text-white">
              {score.totalScore}<span className="text-gray-500 text-2xl">/{score.totalMaxScore}</span>
            </span>
            <span className={`text-xl font-bold mt-1 ${resultColor}`}>{totalPct}%</span>
          </div>
          <div className="flex flex-col">
             <span className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Totale Tijd</span>
             <span className="text-5xl font-mono text-white">{formatTime(score.totalTimeMs)}</span>
          </div>
        </div>
        <p className="text-xl text-gray-300 font-medium">{resultMessage}</p>
      </div>

      {/* Per Test Breakdown */}
      <div className="bg-surface rounded-xl border border-surface-light shadow-md overflow-hidden">
        <div className="bg-surface-light px-6 py-4 border-b border-surface-light flex items-center justify-between">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            {isFull ? 'Volledige Test Analyse' : 'Oefen Test Analyse'}
          </h3>
          <span className="text-sm text-gray-400">Datum: {new Date(score.date).toLocaleDateString('nl-BE')}</span>
        </div>
        
        <div className="divide-y divide-gray-800">
          {tests.map(t => {
            const res = score.results[t.id];
            if (!res) return null;

            const rPct = Math.round((res.score / res.maxScore) * 100);
            const rColor = rPct >= 80 ? 'text-green-400' : rPct >= 60 ? 'text-yellow-400' : 'text-red-400';
            const avgTime = Math.round(res.timeTakenMs / res.maxScore);

            return (
              <div key={t.id} className="p-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 hover:bg-surface-light/30 transition-colors">
                <div className="flex-1 min-w-[200px]">
                  <h4 className="font-bold text-gray-100 text-lg">{t.name}</h4>
                  <div className="text-sm text-gray-500 mt-1">Gemiddeld {Math.round(avgTime/100)/10}s per vraag</div>
                </div>
                
                <div className="flex gap-8 items-center">
                  <div className="text-right">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Score</div>
                    <div className="font-mono text-2xl text-white">{res.score}<span className="text-gray-600 text-lg">/{res.maxScore}</span></div>
                  </div>
                  <div className="text-right w-16">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">%</div>
                    <div className={`font-mono text-2xl font-bold ${rColor}`}>{rPct}%</div>
                  </div>
                  <div className="text-right w-24">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Tijd</div>
                    <div className="font-mono text-2xl text-white">{formatTime(res.timeTakenMs)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-4">
        <button 
          onClick={onHome}
          className="px-8 py-4 bg-military-600 hover:bg-military-500 text-white font-bold rounded shadow transition-all hover:-translate-y-1"
        >
          Terug naar Hoofdmenu
        </button>
        <button 
          onClick={onViewScoreboard}
          className="px-8 py-4 bg-surface hover:bg-surface-light border border-military-700 text-military-400 hover:text-military-300 font-bold rounded shadow transition-all"
        >
          Bekijk Scorebord
        </button>
      </div>

    </div>
  );
};
