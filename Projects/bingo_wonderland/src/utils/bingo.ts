import { BingoCard } from '../types/bingo';
import { christmasEmojis } from './emojis';
import { generateUniqueCard } from './uniqueCards';
import { validateItems } from './validation';
import { christmasWords } from './words';

export const generateBingoCards = (
  items: string[],
  numberOfCards: number,
  mode?: 'words' | 'emojis' | 'custom'
): BingoCard[] => {
  const validation = validateItems(items);
  
  // For custom mode, use only the provided items
  if (mode === 'custom') {
    if (validation.uniqueItems.length < 24) {
      throw new Error('Need at least 24 unique items to generate bingo cards');
    }
    return generateCards(validation.uniqueItems, numberOfCards);
  }

  // For words or emojis mode, combine with default items
  const baseItems = mode === 'words' ? christmasWords : christmasEmojis;
  let bingoItems = [...baseItems];
  
  // Add valid custom items if they exist
  if (validation.uniqueItems.length > 0) {
    //bingoItems = [...bingoItems, ...validation.uniqueItems];
    bingoItems = [...validation.uniqueItems];
  }
  
  // Remove duplicates
  bingoItems = [...new Set(bingoItems)];
  
  if (bingoItems.length < 24) {
    throw new Error('Need at least 24 items to generate bingo cards');
  }
  console.log('Bingo items:', bingoItems);
  return generateCards(bingoItems, numberOfCards);
};

const generateCards = (items: string[], numberOfCards: number): BingoCard[] => {
  const cards: BingoCard[] = [];
  let currentId = 1;

  while (cards.length < numberOfCards) {
    const uniqueCard = generateUniqueCard(cards, items, currentId);
    if (uniqueCard) {
      cards.push(uniqueCard);
      currentId++;
    } else {
      break;
    }
  }

  return cards;
};