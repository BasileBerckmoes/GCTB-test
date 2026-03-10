export type Operator = '+' | '-' | '×' | '÷';

export interface Expression {
  left: number;
  operator: Operator;
  right: number;
  result: number;
}

export interface GetalQuestion {
  id: string;
  topExpression: Expression;
  bottomExpression: Expression;
  correctAnswer: 'B' | 'O' | 'G';
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateExpression(targetResult?: number): Expression {
  const operators: Operator[] = ['+', '-', '×', '÷'];
  const operator = operators[getRandomInt(0, 3)];
  let left = 0;
  let right = 0;
  let result = 0;

  if (targetResult !== undefined) {
    result = targetResult;
    switch (operator) {
      case '+':
        left = getRandomInt(1, Math.max(1, result - 1));
        if (result === 1) {
            right = getRandomInt(1, 20);
            left = result + right;
            return { left, operator: '-', right, result };
        }
        right = result - left;
        break;
      case '-':
        right = getRandomInt(1, 20);
        left = result + right;
        break;
      case '×':
        const factors = [];
        for (let i = 1; i <= result; i++) {
          if (result % i === 0) factors.push(i);
        }
        left = factors[getRandomInt(0, factors.length - 1)];
        right = result / left;
        break;
      case '÷':
        right = getRandomInt(2, 5);
        left = result * right;
        break;
    }
  } else {
    // Generate easier random expression resulting in 1-50
    switch (operator) {
      case '+':
        left = getRandomInt(1, 49);
        right = getRandomInt(1, 50 - left);
        result = left + right;
        break;
      case '-':
        left = getRandomInt(2, 50);
        right = getRandomInt(1, left - 1);
        result = left - right;
        break;
      case '×':
        left = getRandomInt(2, 10);
        right = getRandomInt(2, 10);
        result = left * right;
        break;
      case '÷':
        result = getRandomInt(2, 12);
        right = getRandomInt(2, 5);
        left = result * right;
        break;
    }
  }

  return { left, operator, right, result };
}

export function generateGetalQuestions(count: number = 25): GetalQuestion[] {
  const questions: GetalQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    // Force the distribution roughly 1/3 by forcing the answer target based on index mod 3
    let expectedAnswer: 'B' | 'O' | 'G';
    const mod = i % 3;
    if (mod === 0) expectedAnswer = 'B';
    else if (mod === 1) expectedAnswer = 'O';
    else expectedAnswer = 'G';

    let top: Expression;
    let bottom: Expression;

    if (expectedAnswer === 'G') {
      const target = getRandomInt(1, 50);
      top = generateExpression(target);
      let attempts = 0;
      do {
        bottom = generateExpression(target);
        attempts++;
      } while (
        attempts < 10 && 
        top.left === bottom.left && 
        top.operator === bottom.operator
      );
    } else {
      top = generateExpression();
      let attempts = 0;
      do {
        bottom = generateExpression();
        attempts++;
      } while (attempts < 50 && (
         top.result === bottom.result || 
         (expectedAnswer === 'B' && top.result <= bottom.result) ||
         (expectedAnswer === 'O' && top.result >= bottom.result)
      ));
      
      // Safety net if loop didn't find match (should be rare)
      if (top.result === bottom.result) {
        expectedAnswer = 'G';
      } else if (top.result > bottom.result) {
        expectedAnswer = 'B';
      } else {
        expectedAnswer = 'O';
      }
    }

    questions.push({
      id: `getal-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`,
      topExpression: top,
      bottomExpression: bottom,
      correctAnswer: expectedAnswer
    });
  }
  
  // Shuffle the questions so the B/O/G pattern pattern isn't obvious
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}
