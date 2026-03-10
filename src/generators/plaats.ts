export type ArrowColor = 'Zwart' | 'Wit';
export type ArrowDirection = 'Rechts Op' | 'Links Op' | 'Rechts Neer' | 'Links Neer';

export interface Arrow {
  color: ArrowColor;
  direction: ArrowDirection;
}

export interface Cell {
  top: Arrow;
  bottom: Arrow;
}

export interface RulePair {
  topColor: ArrowColor;
  bottomColor: ArrowColor;
  topDirection: ArrowDirection;
  bottomDirection: ArrowDirection;
}

export interface PlaatsQuestion {
  id: string;
  rulesText: [string, string]; // [Color rule, Direction rule]
  grid: Cell[]; // 6 cells
  correctIndex: number; // 0-5
}

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const COLORS: ArrowColor[] = ['Zwart', 'Wit'];
const DIRECTIONS: ArrowDirection[] = ['Rechts Op', 'Links Op', 'Rechts Neer', 'Links Neer'];

export function generatePlaatsQuestions(count: number = 25): PlaatsQuestion[] {
  const questions: PlaatsQuestion[] = [];

  for (let i = 0; i < count; i++) {
    // 1. Generate Rules
    const topColor = getRandom(COLORS);
    const bottomColor = topColor === 'Zwart' ? 'Wit' : 'Zwart'; // Always opposite colors
    const topDirection = getRandom(DIRECTIONS);
    const bottomDirection = getRandom(DIRECTIONS);

    const colorRelation = Math.random() < 0.5 ? 'BOVEN' : 'ONDER';
    const directionRelation = Math.random() < 0.5 ? 'BOVEN' : 'ONDER';

    const rulesText: [string, string] = [
      `${topColor} ${colorRelation} ${bottomColor}`,
      `${topDirection} ${directionRelation} ${bottomDirection}`,
    ];

    // 2. The correct cell
    // If the rule says X ONDER Y, it means Y is on top and X is on the bottom.
    // Since topColor/bottomColor variables represent the text in the rule, we must map them to actual cell positions physically.
    
    const actualTopColor = colorRelation === 'BOVEN' ? topColor : bottomColor;
    const actualBottomColor = colorRelation === 'BOVEN' ? bottomColor : topColor;
    
    const actualTopDirection = directionRelation === 'BOVEN' ? topDirection : bottomDirection;
    const actualBottomDirection = directionRelation === 'BOVEN' ? bottomDirection : topDirection;

    const correctCell: Cell = {
      top: { color: actualTopColor, direction: actualTopDirection },
      bottom: { color: actualBottomColor, direction: actualBottomDirection },
    };

    const grid: Cell[] = [correctCell];

    // 3. Generate 5 unique distractor cells
    const seen = new Set<string>();
    seen.add(JSON.stringify(correctCell));

    while (grid.length < 6) {
      const gTopC = getRandom(COLORS);
      const gBotC = gTopC === 'Zwart' ? 'Wit' : 'Zwart'; // Always opposite colors
      const gTopD = getRandom(DIRECTIONS);
      const gBotD = getRandom(DIRECTIONS);

      const cell: Cell = {
        top: { color: gTopC, direction: gTopD },
        bottom: { color: gBotC, direction: gBotD },
      };

      const cellStr = JSON.stringify(cell);
      
      // Ensure it doesn't match BOTH rules (can match one)
      const matchesColorRule = colorRelation === 'BOVEN' 
        ? (gTopC === topColor && gBotC === bottomColor)
        : (gTopC === bottomColor && gBotC === topColor);

      const matchesDirectionRule = directionRelation === 'BOVEN'
        ? (gTopD === topDirection && gBotD === bottomDirection)
        : (gTopD === bottomDirection && gBotD === topDirection);

      const matchesBoth = matchesColorRule && matchesDirectionRule;

      if (!matchesBoth && !seen.has(cellStr)) {
        seen.add(cellStr);
        grid.push(cell);
      }
    }

    // 4. Shuffle the grid
    for (let k = grid.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [grid[k], grid[j]] = [grid[j], grid[k]];
    }

    // Find new index
    const correctIndex = grid.findIndex(
      c => c.top.color === actualTopColor && c.bottom.color === actualBottomColor &&
           c.top.direction === actualTopDirection && c.bottom.direction === actualBottomDirection
    );

    questions.push({
      id: `plaats-${Date.now()}-${i}`,
      rulesText,
      grid,
      correctIndex
    });
  }

  return questions;
}
