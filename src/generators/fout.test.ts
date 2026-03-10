import { describe, it, expect } from 'vitest';
import { generateFoutQuestions } from './fout';

describe('Foutdetectietest Generator', () => {
  it('generates correct number of questions', () => {
    const qs = generateFoutQuestions(25);
    expect(qs).toHaveLength(25);
  });

  it('copy has correct number of differences from original', () => {
    const qs = generateFoutQuestions(100);
    
    for (const q of qs) {
      let diffCount = 0;
      for (let i = 0; i < q.original.length; i++) {
        if (q.original[i] !== q.copy[i]) {
          diffCount++;
        }
      }
      expect(diffCount).toBe(q.correctCount);
    }
  });

  it('structural characters are not modified', () => {
    const qs = generateFoutQuestions(50);
    for (const q of qs) {
      for (let i = 0; i < q.original.length; i++) {
        const char = q.original[i];
        if (['.', '@', ':', '/', ' '].includes(char)) {
          expect(q.copy[i]).toBe(char);
        }
      }
    }
  });

  it('substitutions are type-preserving', () => {
    const qs = generateFoutQuestions(100);
    for (const q of qs) {
      for (let i = 0; i < q.original.length; i++) {
        if (q.original[i] !== q.copy[i]) {
          const origMatch = /[0-9]/.test(q.original[i]) ? 'digit' : /[A-Z]/.test(q.original[i]) ? 'upper' : 'lower';
          const copyMatch = /[0-9]/.test(q.copy[i]) ? 'digit' : /[A-Z]/.test(q.copy[i]) ? 'upper' : 'lower';
          expect(copyMatch).toBe(origMatch);
        }
      }
    }
  });

  it('has a balanced distribution of 0-4 errors', () => {
    const qs = generateFoutQuestions(25);
    const counts = [0, 0, 0, 0, 0];
    for (const q of qs) {
      counts[q.correctCount]++;
    }
    counts.forEach(c => {
      // With 5 buckets and 25 questions, each appears exactly 5 times due to mod 5 logic
      expect(c).toBe(5);
    });
  });

  it('generates unique questions', () => {
    const qs = generateFoutQuestions(150);
    const ids = new Set(qs.map(q => q.id));
    expect(ids.size).toBe(150);

    const signatures = new Set(qs.map(q => `${q.original}->${q.copy}`));
    expect(signatures.size).toBeGreaterThan(140);
  });
});
