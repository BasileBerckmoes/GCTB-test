import { describe, it, expect } from 'vitest';
import { generatePlaatsQuestions } from './plaats';

describe('Plaatsbepalingstest Generator', () => {
  it('generates correct number of questions', () => {
    const qs = generatePlaatsQuestions(25);
    expect(qs).toHaveLength(25);
  });

  it('exactly 1 cell matches both rules', () => {
    const qs = generatePlaatsQuestions(150);
    
    for (const q of qs) {
      const [colorRule, dirRule] = q.rulesText;
      // Parse color rule
      const colorRelation = colorRule.includes(' BOVEN ') ? 'BOVEN' : 'ONDER';
      const [color1, color2] = colorRule.split(` ${colorRelation} `);
      const topColor = colorRelation === 'BOVEN' ? color1 : color2;
      const botColor = colorRelation === 'BOVEN' ? color2 : color1;

      // Parse direction rule
      const dirRelation = dirRule.includes(' BOVEN ') ? 'BOVEN' : 'ONDER';
      const [dir1, dir2] = dirRule.split(` ${dirRelation} `);
      const topDir = dirRelation === 'BOVEN' ? dir1 : dir2;
      const botDir = dirRelation === 'BOVEN' ? dir2 : dir1;

      let matchCount = 0;
      let matchedIndex = -1;

      q.grid.forEach((cell, idx) => {
        const matchesColor = cell.top.color === topColor && cell.bottom.color === botColor;
        const matchesDir = cell.top.direction === topDir && cell.bottom.direction === botDir;

        if (matchesColor && matchesDir) {
          matchCount++;
          matchedIndex = idx;
        }
      });

      expect(matchCount).toBe(1);
      expect(matchedIndex).toBe(q.correctIndex);
    }
  });

  it('distractor cells violate at least one rule', () => {
    const qs = generatePlaatsQuestions(50);
    
    for (const q of qs) {
      const [colorRule, dirRule] = q.rulesText;

      const colorRelation = colorRule.includes(' BOVEN ') ? 'BOVEN' : 'ONDER';
      const [color1, color2] = colorRule.split(` ${colorRelation} `);
      const topColor = colorRelation === 'BOVEN' ? color1 : color2;
      const botColor = colorRelation === 'BOVEN' ? color2 : color1;

      const dirRelation = dirRule.includes(' BOVEN ') ? 'BOVEN' : 'ONDER';
      const [dir1, dir2] = dirRule.split(` ${dirRelation} `);
      const topDir = dirRelation === 'BOVEN' ? dir1 : dir2;
      const botDir = dirRelation === 'BOVEN' ? dir2 : dir1;

      q.grid.forEach((cell, idx) => {
        if (idx !== q.correctIndex) {
          const matchesColor = cell.top.color === topColor && cell.bottom.color === botColor;
          const matchesDir = cell.top.direction === topDir && cell.bottom.direction === botDir;
          expect(matchesColor && matchesDir).toBe(false);
        }
      });
    }
  });

  it('generates distinct cells in the grid (no duplicates)', () => {
    const qs = generatePlaatsQuestions(50);
    
    for (const q of qs) {
      const strings = q.grid.map(c => JSON.stringify(c));
      const unique = new Set(strings);
      expect(unique.size).toBe(6);
    }
  });

  it('generates unique questions overall', () => {
    const qs = generatePlaatsQuestions(150);
    const ids = new Set(qs.map(q => q.id));
    expect(ids.size).toBe(150);

    const ruleSignatures = new Set(qs.map(q => q.rulesText.join('|')));
    // There are 4 color combos * 16 dir combos = 64 rule combos.
    // So there will be duplicate rules over 150 questions, but the grid + answer makes it unique.
    const fullSignatures = new Set(qs.map(q => 
        q.rulesText.join('|') + '@' + q.correctIndex + '@' + q.grid.map(c => c.top.color).join('')
    ));
    expect(fullSignatures.size).toBeGreaterThan(140);
  });
});
