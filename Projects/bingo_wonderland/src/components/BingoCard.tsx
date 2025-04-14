import React, { forwardRef } from 'react';
import { Download } from 'lucide-react';
import type { BingoCard as BingoCardType } from '../types/bingo';
import { downloadCardAsImage } from '../utils/download';
import { getTemplateById } from '../utils/templates';

interface Props {
  card: BingoCardType;
  customMessage?: string;
  templateBackground: string;
  customTemplateUrl?: string;
}

export const BingoCard = forwardRef<HTMLDivElement, Props>(
  ({ card, customMessage, templateBackground, customTemplateUrl }, ref) => {
    const handleDownload = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const cardElement = document.querySelector(`#bingo-card-${card.id}`);
      if (!cardElement) {
        console.error('Card element not found');
        return;
      }

      try {
        await downloadCardAsImage(cardElement as HTMLElement, card.id);
      } catch (error) {
        console.error('Failed to download card:', error);
      }
    };

    let backgroundUrl = '';
    if (templateBackground.startsWith('custom-')) {
      backgroundUrl = customTemplateUrl || '';
    } else {
      const template = getTemplateById(templateBackground);
      backgroundUrl = template?.url || '';
    }
    
    const cardStyle = backgroundUrl
      ? {
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {};

    return (
      <div className="relative h-full p-3 md:p-6">
        <button
          onClick={handleDownload}
          className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors print:hidden shadow-md"
          title="Download card"
        >
          <Download className="w-4 h-4" />
        </button>
        
        <div 
          ref={ref}
          id={`bingo-card-${card.id}`}
          className="card bg-white rounded-lg shadow-lg p-4 md:p-8 overflow-hidden print:w-full print:h-full print:flex print:flex-col print:origin-center print:p-3"
          style={{
            ...cardStyle,
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          <div className="card-header mb-4 md:mb-6 relative z-10">
            {customMessage && (
              <div className="custom-message text-base md:text-xl text-green-600 font-medium text-center mb-2 md:mb-3 bg-white bg-opacity-80 p-2 rounded">
                {customMessage}
              </div>
            )}
            <h3 className="card-number text-lg md:text-xl font-bold text-center bg-white bg-opacity-80 p-2 rounded">Card #{card.id}</h3>
          </div>
          <div className="grid grid-cols-5 gap-2 md:gap-6 flex-1 relative z-10">
            {card.cells.map((cell, index) => (
              <div
                key={`${card.id}-${index}`}
                className={`cell aspect-square flex items-center justify-center p-1 md:p-2 border-2 border-green-600 rounded
                  ${index === 12 ? 'free-space bg-red-100' : 'bg-white bg-opacity-90 hover:bg-green-50'}`}
              >
                <span className="text-center w-full break-words" style={{
                  fontSize: cell.length > 8 ? '0.75em' : cell.length > 4 ? '1em' : '1.5em',
                  lineHeight: '1.2',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {cell}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);