import { categories, Category, wordBank } from '../data/words';

export interface WoordQuestion {
  id: string;
  rules: [Category, Category, Category];
  words: [string, string, string];
  correctCount: number; // 0, 1, 2, or 3
}

function getRandom<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateWoordQuestions(count: number = 25): WoordQuestion[] {
  const questions: WoordQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    // Force answer distribution to be roughly equal across 0, 1, 2, 3
    const targetScore = i % 4; // Cycles 0, 1, 2, 3

    const rules: [Category, Category, Category] = [
      getRandom(categories),
      getRandom(categories),
      getRandom(categories)
    ];

    // Determine which indices will be matches
    const matchIndices = new Set<number>();
    while (matchIndices.size < targetScore) {
      matchIndices.add(Math.floor(Math.random() * 3));
    }

    const usedWords = new Set<string>();
    const words: [string, string, string] = ['', '', ''];

    for (let slot = 0; slot < 3; slot++) {
      const ruleCategory = rules[slot];

      if (matchIndices.has(slot)) {
        // Pick a matching word
        let word;
        do {
          word = getRandom(wordBank[ruleCategory]);
        } while (usedWords.has(word));
        words[slot] = word;
        usedWords.add(word);
      } else {
        // Pick a mismatching word
        let mismatchCategory;
        do {
          mismatchCategory = getRandom(categories);
        } while (mismatchCategory === ruleCategory);

        let word;
        do {
          word = getRandom(wordBank[mismatchCategory]);
        } while (usedWords.has(word));
        words[slot] = word;
        usedWords.add(word);
      }
    }

    questions.push({
      id: `woord-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`,
      rules,
      words,
      correctCount: targetScore
    });
  }

  // Shuffle questions array
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}
