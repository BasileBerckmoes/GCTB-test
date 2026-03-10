import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as storage from '../utils/storage';

describe('Scoreboard Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('Scoreboard loads and displays previously saved scores', async () => {
    const mockScore = {
      id: 'score-123',
      date: new Date().toISOString(),
      mode: 'practice' as const,
      totalScore: 23,
      totalMaxScore: 25,
      totalTimeMs: 45000,
      results: {
        getalvaardigheid: { testId: 'getalvaardigheid' as const, score: 23, maxScore: 25, timeTakenMs: 45000 },
        plaatsbepaling: null,
        woordgeheugen: null,
        redeneer: null,
        foutdetectie: null
      }
    };
    
    localStorage.setItem('doo-training-scores', JSON.stringify([mockScore]));

    render(<App />);
    const user = userEvent.setup();

    // Wait for the ScoreProvider useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Click "Bekijk Scorebord"
    await user.click(screen.getByText(/Bekijk Scorebord/i));
    
    // Check if score is visible in DOM
    expect(await screen.findByText(/OEFENING/i)).toBeInTheDocument();
    expect(await screen.findByText(/23/i)).toBeInTheDocument();
  });
});

