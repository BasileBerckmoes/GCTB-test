import { describe, it, expect } from 'vitest';
import { generateWoordQuestions } from './woord';
import { categories, wordBank, Category } from '../data/words';

describe('Woordgeheugentest Generator', () => {
  it('generates correct number of questions', () => {
    const qs = generateWoordQuestions(25);
    expect(qs).toHaveLength(25);
  });

  it('correctCount matches the actual number of matching words', () => {
    const qs = generateWoordQuestions(150);
    
    // Reverse map to lookup category by word fast
    const wordToCategory = new Map<string, Category>();
    categories.forEach(cat => {
      wordBank[cat].forEach(word => {
        wordToCategory.set(word, cat);
      });
    });

    for (const q of qs) {
      let actualScore = 0;
      for (let i = 0; i < 3; i++) {
        if (wordToCategory.get(q.words[i]) === q.rules[i]) {
          actualScore++;
        }
      }
      expect(q.correctCount).toBe(actualScore);
    }
  });

  it('no duplicate words within a single question', () => {
    const qs = generateWoordQuestions(100);
    for (const q of qs) {
      const uniqueWords = new Set(q.words);
      expect(uniqueWords.size).toBe(3);
    }
  });

  it('balanced distribution of answers', () => {
    const qs = generateWoordQuestions(25);
    const counts = [0, 0, 0, 0];
    for (const q of qs) {
      counts[q.correctCount]++;
    }
    // With 25 questions, and cycled distribution before shuffle, 
    // each answer should appear 6 or 7 times.
    counts.forEach(c => {
      expect(c).toBeGreaterThanOrEqual(6);
    });
  });

  it('all words used are defined and valid', () => {
    const qs = generateWoordQuestions(50);
    for (const q of qs) {
      for (const w of q.words) {
        expect(w).toBeTruthy();
        expect(typeof w).toBe('string');
      }
    }
  });

  it('generates unique questions', () => {
     const qs = generateWoordQuestions(150);
     const ids = new Set(qs.map(q => q.id));
     expect(ids.size).toBe(150);

     const signatures = new Set(qs.map(q => 
        q.rules.join('|') + '::' + q.words.join('|')
     ));
     expect(signatures.size).toBeGreaterThan(140);
  });
});
