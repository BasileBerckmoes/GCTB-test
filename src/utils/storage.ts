import { ScoreEntry } from '../types';

const STORAGE_KEY = 'doo-training-scores';

export const getScores = (): ScoreEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to parse scores from localStorage', e);
    return [];
  }
};

export const saveScore = (score: ScoreEntry): void => {
  try {
    const scores = getScores();
    scores.push(score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Failed to save score to localStorage', e);
  }
};

export const deleteScore = (id: string): void => {
  try {
    const scores = getScores();
    const updated = scores.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete score', e);
  }
};

export const clearAllScores = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
