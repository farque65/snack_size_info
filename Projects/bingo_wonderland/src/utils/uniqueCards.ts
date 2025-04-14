import { BingoCard } from '../types/bingo';

// Check if two cards have the same items in the same positions
export const areCardsEqual = (card1: BingoCard, card2: BingoCard): boolean => {
  return card1.cells.every((cell, index) => cell === card2.cells[index]);
};

// Generate a unique card that doesn't match any existing cards
export const generateUniqueCard = (
  existingCards: BingoCard[],
  items: string[],
  id: number,
  maxAttempts = 1000
): BingoCard | null => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    const cells = [
      ...shuffledItems.slice(0, 12),
      '⭐',
      ...shuffledItems.slice(12, 24)
    ];
    
    const newCard: BingoCard = { id, cells };
    
    // Check if this card is unique
    const isDuplicate = existingCards.some(card => areCardsEqual(card, newCard));
    
    if (!isDuplicate) {
      return newCard;
    }
    
    attempts++;
  }
  
  return null; // Could not generate a unique card after max attempts
};