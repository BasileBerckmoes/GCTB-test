import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ScoreEntry } from '../types';
import { getScores, saveScore as persistScore, deleteScore as removeScore, clearAllScores as removeAllScores } from '../utils/storage';

interface ScoreContextType {
  scores: ScoreEntry[];
  addScore: (score: ScoreEntry) => void;
  deleteScore: (id: string) => void;
  clearScores: () => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

export const ScoreProvider = ({ children }: { children: ReactNode }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  const addScore = (score: ScoreEntry) => {
    persistScore(score);
    setScores(getScores());
  };

  const deleteEntry = (id: string) => {
    removeScore(id);
    setScores(getScores());
  };

  const clearScores = () => {
    removeAllScores();
    setScores([]);
  };

  return (
    <ScoreContext.Provider value={{ scores, addScore, deleteScore: deleteEntry, clearScores }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScores = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScores must be used within a ScoreProvider');
  }
  return context;
};
