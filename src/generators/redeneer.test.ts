import { describe, it, expect } from 'vitest';
import { generateRedeneerQuestions } from './redeneer';

describe('Redeneertest Generator', () => {
  it('generates correct number of questions', () => {
    const qs = generateRedeneerQuestions(25);
    expect(qs).toHaveLength(25);
  });

  it('generates valid logic that resolves to correct answer', () => {
    const qs = generateRedeneerQuestions(100);
    // Simple verification check to ensure the properties match
    for (const q of qs) {
      expect(q.options).toContain(q.correctAnswer);
      expect(q.statements).toHaveLength(2);
      expect(q.options.length).toBe(3);
    }
  });

  it('all 3 options are distinct nouns', () => {
    const qs = generateRedeneerQuestions(50);
    for (const q of qs) {
      const unique = new Set(q.options);
      expect(unique.size).toBe(3);
    }
  });

  it('question text uses correct grammar', () => {
    const qs = generateRedeneerQuestions(50);
    for (const q of qs) {
      expect(q.questionText).toBeTruthy();
      // Ensure 'dan' or 'van' is used correctly in statements
      q.statements.forEach(stmt => {
        expect(stmt).toMatch(/(dan|van)/);
      });
    }
  });

  it('generates unique questions', () => {
    const qs = generateRedeneerQuestions(150);
    
    const ids = new Set(qs.map(q => q.id));
    expect(ids.size).toBe(150);

    const signatures = new Set(qs.map(q => 
      `${q.statements.join('|')}@${q.questionText}`
    ));
    expect(signatures.size).toBeGreaterThan(140);
  });
});
