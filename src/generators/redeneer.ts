import { themes, Theme, nounPools } from '../data/nouns';

export const dimensions = [
  'Grootte', 'Snelheid', 'Afstand', 'Hoogte', 'Gewicht', 'Positie'
] as const;

export type Dimension = (typeof dimensions)[number];

const comparatives = {
  Grootte: { more: 'groter', less: 'kleiner', maxQ: 'Wie is de grootste?', minQ: 'Wie is de kleinste?' },
  Snelheid: { more: 'vlugger', less: 'trager', maxQ: 'Wat is vlugst?', minQ: 'Wat is traagst?' },
  Afstand: { more: 'verder', less: 'dichterbij', maxQ: 'Wat is verst?', minQ: 'Wat is dichtst bij?' },
  Hoogte: { more: 'hoger', less: 'lager', maxQ: 'Wat is hoogst?', minQ: 'Wat is laagst?' },
  Gewicht: { more: 'zwaarder', less: 'lichter', maxQ: 'Wat is zwaarst?', minQ: 'Wat is lichtst?' },
  Positie: { more: 'verder naar rechts', less: 'verder naar links', maxQ: 'Wat is verst naar rechts?', minQ: 'Wat is verst naar links?' }, // the PRD says links/rechts van, let's just use 'rechts van' / 'links van'
};

const comparativesAccurate = {
  Grootte: { more: 'groter dan', less: 'kleiner dan', maxQ: 'Wie is de grootste?', minQ: 'Wie is de kleinste?' },
  Snelheid: { more: 'vlugger dan', less: 'trager dan', maxQ: 'Wat is vlugst?', minQ: 'Wat is traagst?' },
  Afstand: { more: 'verder dan', less: 'dichterbij dan', maxQ: 'Wat is verst?', minQ: 'Wat is dichtst bij?' },
  Hoogte: { more: 'hoger dan', less: 'lager dan', maxQ: 'Wat is hoogst?', minQ: 'Wat is laagst?' },
  Gewicht: { more: 'zwaarder dan', less: 'lichter dan', maxQ: 'Wat is zwaarst?', minQ: 'Wat is lichtst?' },
  Positie: { more: 'rechts van', less: 'links van', maxQ: 'Wat is verst naar rechts?', minQ: 'Wat is verst naar links?' },
};

export interface RedeneerQuestion {
  id: string;
  statements: [string, string];
  questionText: string;
  options: [string, string, string];
  correctAnswer: string;
}

function getRandom<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateRedeneerQuestions(count: number = 25): RedeneerQuestion[] {
  const questions: RedeneerQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    const dimension = getRandom(dimensions);
    const askMax = Math.random() > 0.5;
    
    const theme = getRandom(themes);
    const pool = nounPools[theme];
    
    // Pick 3 unique nouns
    const shuffledPool = shuffle([...pool]);
    const A = shuffledPool[0]; // Represents the MAX
    const B = shuffledPool[1]; // MID
    const C = shuffledPool[2]; // MIN
    
    const comp = comparativesAccurate[dimension];

    // Create 2 statements that establish A > B > C.
    // We can say A > B, B > C. Or variations like B < A, C < B.
    // Statement 1 connects A and B. Statement 2 connects B and C.
    
    let statement1 = '';
    let statement2 = '';
    
    if (Math.random() > 0.5) {
      statement1 = `${A} is ${comp.more} ${B}`;
    } else {
      statement1 = `${B} is ${comp.less} ${A}`;
    }
    
    if (Math.random() > 0.5) {
      statement2 = `${B} is ${comp.more} ${C}`;
    } else {
      statement2 = `${C} is ${comp.less} ${B}`;
    }

    // Sometimes swap the order of statements
    let statements: [string, string];
    if (Math.random() > 0.5) {
      statements = [statement1, statement2];
    } else {
      statements = [statement2, statement1];
    }

    const questionText = askMax ? comp.maxQ : comp.minQ;
    const correctAnswer = askMax ? A : C;
    
    const options = shuffle([A, B, C]) as [string, string, string];

    questions.push({
      id: `redeneer-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`,
      statements,
      questionText,
      options,
      correctAnswer
    });
  }

  return questions;
}
