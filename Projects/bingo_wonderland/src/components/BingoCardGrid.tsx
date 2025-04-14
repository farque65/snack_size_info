import React from 'react';
import { BingoCard as BingoCardComponent } from './BingoCard';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { BingoCard, CustomTemplate } from '../types/bingo';

interface Props {
  cards: BingoCard[];
  cardsPerPage: number;
  customMessage?: string;
  templateBackground: string;
  customTemplateUrl?: string;
  customTemplates: CustomTemplate[];
  refs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  expandedSections: Record<number, boolean>;
  setExpandedSections: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}

export const BingoCardGrid: React.FC<Props> = ({
  cards,
  customMessage,
  templateBackground,
  customTemplateUrl,
  customTemplates,
  refs,
  expandedSections,
  setExpandedSections,
}) => {
  const sections = cards.reduce((acc, card, index) => {
    const sectionIndex = Math.floor(index / 6);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(card);
    return acc;
  }, [] as BingoCard[][]);

  const getTemplateUrl = () => {
    if (templateBackground.startsWith('custom-')) {
      const customTemplate = customTemplates.find(t => t.id === templateBackground);
      return customTemplate?.url || customTemplateUrl;
    }
    return customTemplateUrl;
  };

  const toggleSection = (sectionIndex: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionIndex]: !prev[sectionIndex]
    }));
  };

  return (
    <div>
      <div className="space-y-4 md:space-y-6 print:hidden">
        {sections.map((sectionCards, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button 
              onClick={() => toggleSection(sectionIndex)}
              className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-base md:text-lg font-medium">Cards {sectionIndex * 6 + 1} - {Math.min((sectionIndex + 1) * 6, cards.length)}</h3>
              {expandedSections[sectionIndex] ? 
                <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-600" /> : 
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              }
            </button>
            
            {expandedSections[sectionIndex] && (
              <div className="p-2 md:p-4">
                <div className="space-y-4 md:space-y-6">
                  {sectionCards.map((card, index) => (
                    <div key={card.id} className="bingo-card-wrapper max-w-3xl mx-auto">
                      <BingoCardComponent
                        card={card}
                        customMessage={customMessage}
                        templateBackground={templateBackground}
                        customTemplateUrl={getTemplateUrl()}
                        ref={el => {
                          const globalIndex = sectionIndex * 6 + index;
                          if (refs.current) {
                            refs.current[globalIndex] = el;
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hidden container for download/print purposes */}
      <div className="hidden" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {cards.map((card, index) => (
          <div
            key={`download-${card.id}`}
            className="w-[800px]"
          >
            <BingoCardComponent
              card={card}
              customMessage={customMessage}
              templateBackground={templateBackground}
              customTemplateUrl={getTemplateUrl()}
              ref={el => {
                if (refs.current) {
                  refs.current[index] = el;
                }
              }}
            />
          </div>
        ))}
      </div>

      <div className="hidden print:block">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="print:w-full print:h-full print:flex print:items-center print:justify-center"
            style={{ pageBreakAfter: 'always' }}
          >
            <div className="print:w-[90%] print:max-w-4xl print:mx-auto">
              <BingoCardComponent
                card={card}
                customMessage={customMessage}
                templateBackground={templateBackground}
                customTemplateUrl={getTemplateUrl()}
                ref={el => {
                  if (refs.current) {
                    refs.current[index] = el;
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};