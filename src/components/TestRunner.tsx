import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScoreEntry, TestResult, TestType } from '../types';
import { generateGetalQuestions } from '../generators/getal';
import { generatePlaatsQuestions } from '../generators/plaats';
import { generateWoordQuestions } from '../generators/woord';
import { generateRedeneerQuestions } from '../generators/redeneer';
import { generateFoutQuestions } from '../generators/fout';

import { GetalTest } from './tests/GetalTest';
import { PlaatsTest } from './tests/PlaatsTest';
import { WoordTest } from './tests/WoordTest';
import { RedeneerTest } from './tests/RedeneerTest';
import { FoutTest } from './tests/FoutTest';

import { useTimer } from '../utils/timer';

interface TestRunnerProps {
  mode: 'full' | 'shortFull' | 'practice';
  practiceTestId?: TestType;
  onComplete: (score: ScoreEntry) => void;
  onHomeClick: () => void;
}

const TEST_CONFIG = [
  { id: 'getalvaardigheid', generator: generateGetalQuestions, Component: GetalTest },
  { id: 'plaatsbepaling', generator: generatePlaatsQuestions, Component: PlaatsTest },
  { id: 'woordgeheugen', generator: generateWoordQuestions, Component: WoordTest },
  { id: 'redeneer', generator: generateRedeneerQuestions, Component: RedeneerTest },
  { id: 'foutdetectie', generator: generateFoutQuestions, Component: FoutTest },
] as const;



export const TestRunner: React.FC<TestRunnerProps> = ({ mode, practiceTestId, onComplete, onHomeClick }) => {
  const testsToRun = useMemo(() => {
    if (mode === 'practice' && practiceTestId) {
      return TEST_CONFIG.filter(t => t.id === practiceTestId);
    }
    return TEST_CONFIG;
  }, [mode, practiceTestId]);

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionsPerTest = mode === 'practice' ? 3 : mode === 'shortFull' ? 5 : 25;

  // Pre-generate questions for current test
  const [questions, setQuestions] = useState<any[]>([]);

  // Intermediate state
  const [isBetweenTests, setIsBetweenTests] = useState(false);

  // Score tracking
  const [results, setResults] = useState<Record<TestType, TestResult | null>>({
    getalvaardigheid: null,
    plaatsbepaling: null,
    woordgeheugen: null,
    redeneer: null,
    foutdetectie: null
  });

  const [currentTestScore, setCurrentTestScore] = useState(0);

  const testRunning = currentTestIndex < testsToRun.length;
  
  // Timer hooks
  const totalTimer = useTimer(testRunning && !isBetweenTests);
  const testTimer = useTimer(testRunning && !isBetweenTests);

  // Load questions when test index changes
  useEffect(() => {
    if (currentTestIndex < testsToRun.length && !isBetweenTests) {
      const config = testsToRun[currentTestIndex];
      setQuestions(config.generator(questionsPerTest));
      setCurrentQuestionIndex(0);
      setCurrentTestScore(0);
      testTimer.reset();
    }
  }, [currentTestIndex, testsToRun, questionsPerTest, isBetweenTests]); 

  const handleAnswer = useCallback((answer: any) => {
    if (!testRunning || isBetweenTests) return;

    const currentConfig = testsToRun[currentTestIndex];
    if (!questions[currentQuestionIndex]) return;
    
    const currentQ = questions[currentQuestionIndex];
    
    // Check correctness based on test type
    let isCorrect = false;
    if (currentConfig.id === 'getalvaardigheid') isCorrect = answer === currentQ.correctAnswer;
    else if (currentConfig.id === 'plaatsbepaling') isCorrect = answer === currentQ.correctIndex;
    else if (currentConfig.id === 'woordgeheugen') isCorrect = answer === currentQ.correctCount;
    else if (currentConfig.id === 'redeneer') isCorrect = answer === currentQ.correctAnswer;
    else if (currentConfig.id === 'foutdetectie') isCorrect = answer === currentQ.correctCount;

    if (isCorrect) {
      setCurrentTestScore(prev => prev + 1);
    }

    // Advance
    if (currentQuestionIndex < questionsPerTest - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Test finished
      const testId = currentConfig.id as TestType;
      const testResult: TestResult = {
        testId,
        score: currentTestScore + (isCorrect ? 1 : 0),
        maxScore: questionsPerTest,
        timeTakenMs: testTimer.elapsedMs
      };

      const newResults = { ...results, [testId]: testResult };
      setResults(newResults);

      if (currentTestIndex < testsToRun.length - 1) {
        // Show intermediary screen
        setIsBetweenTests(true);
      } else {
        // All tests finished
        let tScore = 0;
        let tMax = 0;
        Object.values(newResults).forEach(r => {
          if (r) {
            tScore += r.score;
            tMax += r.maxScore;
          }
        });

        const entry: ScoreEntry = {
          id: `score-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          date: new Date().toISOString(),
          mode,
          results: newResults,
          totalScore: tScore,
          totalMaxScore: tMax,
          totalTimeMs: totalTimer.elapsedMs
        };

        onComplete(entry);
      }
    }
  }, [testRunning, isBetweenTests, testsToRun, currentTestIndex, currentQuestionIndex, questions, questionsPerTest, currentTestScore, results, mode, testTimer.elapsedMs, totalTimer.elapsedMs, onComplete]);

  if (!testRunning) return null;

  if (isBetweenTests) {
    const prevConfig = testsToRun[currentTestIndex];
    const prevResult = results[prevConfig.id as TestType];
    const nextConfig = testsToRun[currentTestIndex + 1];

    let testName = nextConfig.id.toUpperCase();
    if (nextConfig.id === 'getalvaardigheid') testName = 'GETALVAARDIGHEIDSTEST';
    if (nextConfig.id === 'plaatsbepaling') testName = 'PLAATSBEPALINGSTEST';
    if (nextConfig.id === 'woordgeheugen') testName = 'WOORDGEHEUGENTEST';
    if (nextConfig.id === 'redeneer') testName = 'REDENEERTEST';
    if (nextConfig.id === 'foutdetectie') testName = 'FOUTDETECTIETEST';

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 animate-fade-in">
        <h2 className="text-3xl font-bold uppercase tracking-widest text-military-500">Onderdeel Voltooid</h2>
        
        <div className="bg-surface p-10 rounded-xl border border-surface-light text-center shadow-lg w-full max-w-md">
          <p className="text-gray-400 font-bold uppercase tracking-widest mb-2 text-sm">Jouw Score</p>
          <div className="text-6xl font-mono text-white mb-8 border-b border-gray-800 pb-8">
            {prevResult?.score} <span className="text-gray-600 text-3xl">/ {prevResult?.maxScore}</span>
            <div className="text-sm font-sans text-gray-400 mt-2 uppercase tracking-wide">
              Tijd: {Math.floor((prevResult?.timeTakenMs || 0) / 1000)} seconden
            </div>
          </div>
          
          <button 
            onClick={() => {
              setQuestions([]);
              setIsBetweenTests(false);
              setCurrentTestIndex(prev => prev + 1);
            }}
            className="w-full px-8 py-4 bg-military-600 hover:bg-military-500 text-white font-bold rounded shadow transition-all uppercase tracking-wide flex flex-col items-center gap-1 hover:-translate-y-1"
          >
            <span>Start Volgende Test</span>
            <span className="text-sm text-military-200">({testName}) &rarr;</span>
          </button>
        </div>
      </div>
    );
  }

  // Await generating questions to prevent type mismatch crash
  if (questions.length === 0 || !questions[currentQuestionIndex]) {
     return <div className="text-center text-gray-500 mt-20">Test laden...</div>;
  }

  const currentConfig = testsToRun[currentTestIndex];
  const CurrentComponent = currentConfig.Component as React.FC<any>;

  let testName = currentConfig.id.toUpperCase();
  if (currentConfig.id === 'getalvaardigheid') testName = 'GETALVAARDIGHEIDSTEST';
  if (currentConfig.id === 'plaatsbepaling') testName = 'PLAATSBEPALINGSTEST';
  if (currentConfig.id === 'woordgeheugen') testName = 'WOORDGEHEUGENTEST';
  if (currentConfig.id === 'redeneer') testName = 'REDENEERTEST';
  if (currentConfig.id === 'foutdetectie') testName = 'FOUTDETECTIETEST';

  return (
    <>
      <div className="absolute top-0 right-0 p-4 font-mono text-gray-500 z-50">
         [ {testName} ] Tijd: {Math.floor(testTimer.elapsedMs/1000)}s
      </div>
      <CurrentComponent 
        question={questions[currentQuestionIndex]} 
        onAnswer={handleAnswer} 
      />
    </>
  );
};
