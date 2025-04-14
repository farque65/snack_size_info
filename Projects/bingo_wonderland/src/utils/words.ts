// Christmas-themed words
export const christmasWords = [
  'Santa', 'Reindeer', 'Tree', 'Present', 'Snowman',
  'Snow', 'Sleigh', 'Bells', 'Cookies', 'Milk',
  'Chimney', 'Stocking', 'Lights', 'Ornament', 'Star',
  'Elf', 'Candy Cane', 'Wreath', 'Gingerbread', 'Mistletoe',
  'Carol', 'Eggnog', 'Holly', 'Tinsel', 'Ribbon'
];

export const getRandomWords = (count: number): string[] => {
  const shuffled = [...christmasWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};