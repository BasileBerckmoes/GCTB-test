import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as getalGen from '../generators/getal';

vi.mock('../generators/getal', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    generateGetalQuestions: vi.fn(),
  };
});

describe('Full Test Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('starts test, answers questions, shows results', async () => {
    // Generate just 3 dummy questions for getal test to simulate a practice run
    const dummyQuestions = Array.from({ length: 3 }, (_, i) => ({
      id: `getal-${i}`,
      topExpression: { left: 1, operator: '+', right: 1, result: 2 },
      bottomExpression: { left: 1, operator: '+', right: 2, result: 3 },
      correctAnswer: 'O' as const
    }));

    (getalGen.generateGetalQuestions as any).mockReturnValue(dummyQuestions);

    render(<App />);
    const user = userEvent.setup();

    // Find and click practice test for Getal
    const practiceBtn = await screen.findByText(/Getalvaardigheidstest/i, { selector: 'button' });
    await user.click(practiceBtn);

    // We should be on Screen 1
    for (let i = 0; i < 3; i++) {
       // Screen 1 -> Screen 2
       await user.click(await screen.findByText(/Volgende/i));
       // Screen 2 -> Screen 3
       await user.click(await screen.findByText(/Volgende/i));
       // Screen 3: Auto answers 'O' correctly or B incorrectly. Let's just answer 'O'
       await user.click(await screen.findByText('Onderste is groter'));
    }

    // Now it should show the ResultsScreen
    expect(await screen.findByText(/Oefen Test Analyse/i)).toBeInTheDocument();
    expect(await screen.findByText(/GESLAAGD/i)).toBeInTheDocument(); 
  });
});

