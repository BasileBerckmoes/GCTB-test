import { describe, it, expect } from 'vitest';
import { generateGetalQuestions } from './getal';

describe('Getalvaardigheidstest Generator', () => {
  it('generates correct number of questions', () => {
    const qs = generateGetalQuestions(25);
    expect(qs).toHaveLength(25);
  });

  it('all results are within 1-200 and positive integers', () => {
    const qs = generateGetalQuestions(150);
    for (const q of qs) {
      expect(q.topExpression.result).toBeGreaterThanOrEqual(1);
      expect(q.topExpression.result).toBeLessThanOrEqual(200);
      expect(Number.isInteger(q.topExpression.result)).toBe(true);

      expect(q.bottomExpression.result).toBeGreaterThanOrEqual(1);
      expect(q.bottomExpression.result).toBeLessThanOrEqual(200);
      expect(Number.isInteger(q.bottomExpression.result)).toBe(true);
    }
  });

  it('evaluates B/O/G correctly', () => {
    const qs = generateGetalQuestions(150);
    for (const q of qs) {
      if (q.correctAnswer === 'B') {
        expect(q.topExpression.result).toBeGreaterThan(q.bottomExpression.result);
      } else if (q.correctAnswer === 'O') {
        expect(q.topExpression.result).toBeLessThan(q.bottomExpression.result);
      } else if (q.correctAnswer === 'G') {
        expect(q.topExpression.result).toBe(q.bottomExpression.result);
      }
    }
  });

  it('division has no remainder', () => {
    const qs = generateGetalQuestions(150);
    for (const q of qs) {
      if (q.topExpression.operator === '÷') {
        expect(q.topExpression.left % q.topExpression.right).toBe(0);
      }
      if (q.bottomExpression.operator === '÷') {
        expect(q.bottomExpression.left % q.bottomExpression.right).toBe(0);
      }
    }
  });

  it('has a balanced distribution of B/O/G', () => {
    const qs = generateGetalQuestions(25);
    const counts = { B: 0, O: 0, G: 0 };
    for (const q of qs) counts[q.correctAnswer]++;
    expect(counts.B).toBeGreaterThanOrEqual(5);
    expect(counts.O).toBeGreaterThanOrEqual(5);
    expect(counts.G).toBeGreaterThanOrEqual(5);
  });
  
  it('generates unique questions', () => {
     const qs = generateGetalQuestions(150);
     const ids = new Set(qs.map(q => q.id));
     expect(ids.size).toBe(150);
     
     // also check that the contents are mostly unique
     const signatures = new Set(qs.map(q => 
       `${q.topExpression.left}${q.topExpression.operator}${q.topExpression.right}-${q.bottomExpression.left}${q.bottomExpression.operator}${q.bottomExpression.right}`
     ));
     expect(signatures.size).toBeGreaterThan(140); // allow a few rare duplicates in formulas
  });
});
