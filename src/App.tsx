import React, { useState } from 'react';
import { ScoreProvider, useScores } from './context/ScoreContext';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { TestRunner } from './components/TestRunner';
import { ResultsScreen } from './components/ResultsScreen';
import { Scoreboard } from './components/Scoreboard';
import { ScoreEntry, TestType } from './types';

type AppState = 'landing' | 'running' | 'results' | 'scoreboard';

const MainApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [mode, setMode] = useState<'full' | 'shortFull' | 'practice'>('full');
  const [practiceTestId, setPracticeTestId] = useState<TestType | undefined>(undefined);
  const [lastScore, setLastScore] = useState<ScoreEntry | null>(null);

  const { addScore } = useScores();

  const handleStartFull = () => {
    setMode('full');
    setPracticeTestId(undefined);
    setAppState('running');
  };

  const handleStartShortFull = () => {
    setMode('shortFull');
    setPracticeTestId(undefined);
    setAppState('running');
  };

  const handleStartPractice = (testId: string) => {
    setMode('practice');
    setPracticeTestId(testId as TestType);
    setAppState('running');
  };

  const handleTestComplete = (score: ScoreEntry) => {
    addScore(score);
    setLastScore(score);
    setAppState('results');
  };

  // Determine what props to pass to Layout dynamically
  let headerTitle = 'DOO Training';
  if (appState === 'running') {
    headerTitle = mode === 'full' ? 'Volledige Test' : mode === 'shortFull' ? 'Korte Test' : 'Oefening';
  }

  return (
    <Layout 
      headerTitle={headerTitle}
      onHomeClick={appState !== 'landing' ? () => setAppState('landing') : undefined}
    >
      {appState === 'landing' && (
        <Landing 
          onStartFullTest={handleStartFull}
          onStartShortFullTest={handleStartShortFull}
          onPracticeTest={handleStartPractice}
          onViewScoreboard={() => setAppState('scoreboard')}
        />
      )}

      {appState === 'running' && (
        <TestRunner 
          mode={mode}
          practiceTestId={practiceTestId}
          onComplete={handleTestComplete}
          onHomeClick={() => setAppState('landing')}
        />
      )}

      {appState === 'results' && lastScore && (
        <ResultsScreen 
          score={lastScore} 
          onHome={() => setAppState('landing')}
          onViewScoreboard={() => setAppState('scoreboard')}
        />
      )}

      {appState === 'scoreboard' && (
        <Scoreboard onBack={() => setAppState('landing')} />
      )}
    </Layout>
  );
};

function App() {
  return (
    <ScoreProvider>
      <MainApp />
    </ScoreProvider>
  );
}

export default App;
