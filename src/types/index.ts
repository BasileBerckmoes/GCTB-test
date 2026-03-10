export type TestType = 
  | 'getalvaardigheid'
  | 'plaatsbepaling'
  | 'woordgeheugen'
  | 'redeneer'
  | 'foutdetectie';

export interface TestResult {
  testId: TestType;
  score: number;
  maxScore: number;
  timeTakenMs: number;
}

export interface ScoreEntry {
  id: string;
  date: string; // ISO string
  mode: 'full' | 'shortFull' | 'practice';
  results: Record<TestType, TestResult | null>;
  totalScore: number;
  totalMaxScore: number;
  totalTimeMs: number;
}
