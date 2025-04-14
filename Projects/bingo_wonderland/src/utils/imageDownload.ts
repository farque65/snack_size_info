import { toPng } from 'html-to-image';

export const downloadCardAsImage = async (element: HTMLElement, cardId: number) => {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      backgroundColor: 'white',
    });
    
    const link = document.createElement('a');
    link.download = `bingo-card-${cardId}.jpg`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error generating image:', error);
  }
};