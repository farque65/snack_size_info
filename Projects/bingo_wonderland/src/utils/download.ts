import { toPng } from 'html-to-image';
import JSZip from 'jszip';

// Download single card as image
export const downloadCardAsImage = async (element: HTMLElement, cardId: number) => {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      backgroundColor: 'white',
      width: 800,
      height: 800,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });
    
    const link = document.createElement('a');
    link.download = `bingo-card-${cardId}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating image:', error);
  }
};

// Download all cards as a zip file containing PNGs
export const downloadAllCardsAsImages = async (elements: HTMLElement[]) => {
  try {
    const zip = new JSZip();
    
    // Process cards sequentially to avoid memory issues
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      
      // Generate image with fixed dimensions
      const dataUrl = await toPng(element, {
        quality: 0.95,
        backgroundColor: 'white',
        width: 800,
        height: 800,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      });

      // Convert data URL to binary data
      const data = dataUrl.split(',')[1];
      const binaryData = atob(data);
      const uint8Array = new Uint8Array(binaryData.length);
      for (let j = 0; j < binaryData.length; j++) {
        uint8Array[j] = binaryData.charCodeAt(j);
      }

      // Add to zip with sequential naming
      zip.file(`bingo-card-${i + 1}.png`, uint8Array, { binary: true });

      // Small delay between processing each card
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });

    // Create download link for the zip file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'bingo-cards.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Error generating zip file:', error);
  }
};