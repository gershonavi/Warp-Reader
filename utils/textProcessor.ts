
import { WordData } from '../types';

/**
 * Calculates the Optimal Recognition Point (ORP) index for a word.
 * Based on the Spritz algorithm philosophy:
 * 0-1 letters: 1st letter
 * 2-5 letters: 2nd letter
 * 6-9 letters: 3rd letter
 * 10-13 letters: 4th letter
 * 14+ letters: 5th letter
 */
export const getORPIndex = (word: string): number => {
  const length = word.length;
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
};

export const tokenizeText = (text: string): WordData[] => {
  // Split by whitespace and filter empty strings
  const rawWords = text.trim().split(/\s+/);
  
  return rawWords.map(word => {
    // We keep punctuation for visual context but calculate ORP based on cleaned word
    const cleanWord = word.replace(/[^\w]/g, '');
    return {
      original: word,
      clean: cleanWord,
      orpIndex: getORPIndex(word)
    };
  });
};

export const calculateDelay = (word: string, baseDelay: number): number => {
  let delay = baseDelay;
  
  // Longer pause for punctuation
  if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
    delay *= 2.5;
  } else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) {
    delay *= 1.8;
  } else if (word.length > 8) {
    delay *= 1.2;
  }
  
  return delay;
};
