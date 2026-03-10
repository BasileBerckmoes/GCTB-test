import React, { useMemo } from 'react';
import { useScores } from '../context/ScoreContext';

interface ScoreboardProps {
  onBack: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ onBack }) => {
  const { scores, deleteScore, clearScores } = useScores();

  const sortedScores = useMemo(() => {
    return [...scores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [scores]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString('nl-BE') + ' ' + d.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white uppercase tracking-wide">Scorebord</h2>
        {scores.length > 0 && (
          <button 
            onClick={() => {
              if (window.confirm('Weet u zeker dat u alle scores wilt wissen?')) {
                clearScores();
              }
            }}
            className="text-red-400 hover:text-red-300 text-sm border border-red-900/50 hover:bg-red-900/20 px-4 py-2 rounded transition-colors"
          >
            Wis Alle Scores
          </button>
        )}
      </div>

      {scores.length === 0 ? (
        <div className="bg-surface border border-surface-light rounded-xl p-12 text-center text-gray-400">
          Weinig te zien hier... Begin met trainen!
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-surface-light overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-light text-gray-300 uppercase text-xs tracking-wider border-b border-gray-800">
                  <th className="p-4 font-semibold">Datum</th>
                  <th className="p-4 font-semibold">Modus</th>
                  <th className="p-4 font-semibold text-center">Score</th>
                  <th className="p-4 font-semibold text-center">%</th>
                  <th className="p-4 font-semibold text-center">Tijd</th>
                  <th className="p-4 font-semibold">Actie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sortedScores.map(score => {
                  const pct = Math.round((score.totalScore / score.totalMaxScore) * 100);
                  const isPass = pct >= 80;
                  const isWarn = pct >= 60 && pct < 80;
                  const colorClass = isPass ? 'text-green-500' : isWarn ? 'text-yellow-500' : 'text-red-500';

                  return (
                    <tr key={score.id} className="hover:bg-surface-light/50 transition-colors">
                      <td className="p-4 text-gray-300 whitespace-nowrap">{formatDate(score.date)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${score.mode === 'full' || score.mode === 'shortFull' ? 'bg-military-900 text-military-400 border border-military-700' : 'bg-gray-800 text-gray-300 border border-gray-700'}`}>
                          {score.mode === 'full' ? 'VOLLEDIG' : score.mode === 'shortFull' ? 'KORT (TEST)' : 'OEFENING'}
                        </span>
                      </td>
                      <td className="p-4 text-center text-white font-mono">
                        {score.totalScore} <span className="text-gray-500">/ {score.totalMaxScore}</span>
                      </td>
                      <td className={`p-4 text-center font-bold ${colorClass}`}>
                        {pct}%
                      </td>
                      <td className="p-4 text-center text-gray-400 font-mono">
                        {formatTime(score.totalTimeMs)}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => deleteScore(score.id)}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                          title="Verwijder score"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-8">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-military-700 hover:bg-military-600 text-white rounded shadow transition-colors font-medium"
        >
          Terug naar Menu
        </button>
      </div>
    </div>
  );
};
