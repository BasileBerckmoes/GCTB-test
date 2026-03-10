export type FoutFormat = 'URL' | 'Email' | 'License' | 'Address' | 'AlphaNum' | 'PlateCode';

export interface FoutQuestion {
  id: string;
  formatType: FoutFormat;
  original: string;
  copy: string;
  correctCount: number; // 0-4
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChar(chars: string): string {
  return chars.charAt(getRandomInt(0, chars.length - 1));
}

function generateString(format: FoutFormat): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  let str = '';
  switch (format) {
    case 'URL':
      str = `http://www.`;
      for (let i = 0; i < getRandomInt(5, 8); i++) str += getRandomChar(letters);
      str += `.` + (Math.random() > 0.5 ? 'com' : 'be');
      break;
    case 'Email':
      for (let i = 0; i < 3; i++) str += getRandomChar(letters);
      for (let i = 0; i < 3; i++) str += getRandomChar(digits);
      str += `@`;
      for (let i = 0; i < getRandomInt(3, 5); i++) str += getRandomChar(letters);
      str += `.com`;
      break;
    case 'License':
      for (let i = 0; i < 2; i++) str += getRandomChar(lettersUpper);
      str += ` `;
      for (let i = 0; i < 5; i++) str += getRandomChar(digits);
      break;
    case 'Address':
      const places = ['Tristdene', 'Molendorp', 'Kerkhoven', 'Boskant', 'Veldweg'];
      str = places[getRandomInt(0, places.length - 1)];
      str += ` ${getRandomInt(1, 999)}`;
      break;
    case 'AlphaNum':
      for (let i = 0; i < 2; i++) str += getRandomChar(lettersUpper);
      str += ` `;
      for (let i = 0; i < 5; i++) str += getRandomChar(digits);
      break;
    case 'PlateCode':
      str = `${getRandomChar(lettersUpper)} `;
      for (let i = 0; i < 3; i++) str += getRandomChar(digits);
      str += ` `;
      for (let i = 0; i < 3; i++) str += getRandomChar(lettersUpper);
      break;
  }
  return str;
}

export function generateFoutQuestions(count: number = 25): FoutQuestion[] {
  const questions: FoutQuestion[] = [];
  const formats: FoutFormat[] = ['URL', 'Email', 'License', 'Address', 'AlphaNum', 'PlateCode'];
  
  for (let i = 0; i < count; i++) {
    const errorCount = i % 5; // force distribution 0, 1, 2, 3, 4
    const format = formats[getRandomInt(0, formats.length - 1)];
    
    const original = generateString(format);
    const chars = original.split('');
    
    // Pick modifiable indices (not structural)
    const modifiableIndices: number[] = [];
    for (let j = 0; j < chars.length; j++) {
      if (!['.', '@', ':', '/', ' '].includes(chars[j])) {
        // Only modify ascii alpha or digits, not word parts like 'com' rigidly to keep it natural, 
        // but PRD says any character type-preserving. We'll allow modifying any non-structural character.
        modifiableIndices.push(j);
      }
    }
    
    // Pick errorCount distinct indices
    const selectedIndices = new Set<number>();
    while (selectedIndices.size < errorCount && selectedIndices.size < modifiableIndices.length) {
      selectedIndices.add(modifiableIndices[getRandomInt(0, modifiableIndices.length - 1)]);
    }

    selectedIndices.forEach(idx => {
      const origChar = chars[idx];
      let newChar = origChar;
      
      const isDigit = /[0-9]/.test(origChar);
      const isUpper = /[A-Z]/.test(origChar);
      const isLower = /[a-z]/.test(origChar);

      if (isDigit) {
        do { newChar = getRandomChar('0123456789'); } while (newChar === origChar);
      } else if (isUpper) {
        do { newChar = getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); } while (newChar === origChar);
      } else if (isLower) {
        do { newChar = getRandomChar('abcdefghijklmnopqrstuvwxyz'); } while (newChar === origChar);
      }
      chars[idx] = newChar;
    });

    questions.push({
      id: `fout-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`,
      formatType: format,
      original,
      copy: chars.join(''),
      correctCount: selectedIndices.size
    });
  }

  // Shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}
