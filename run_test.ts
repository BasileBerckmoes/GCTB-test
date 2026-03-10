import { generatePlaatsQuestions } from './src/generators/plaats';
const questions = generatePlaatsQuestions(2);
console.log(JSON.stringify(questions[0].rulesText));
console.log(JSON.stringify(questions[0].grid.map(c => [c.top.color, c.bottom.color])));
