import React from 'react';
import { NewsStory } from '../data/mockNews';
import { X, Bookmark, ExternalLink } from 'lucide-react';
interface SavedStoriesProps {
  stories: NewsStory[];
  isOpen: boolean;
  onClose: () => void;
  onUnsave: (id: string) => void;
  onExpandSources: (id: string) => void;
}
export function SavedStories({
  stories,
  isOpen,
  onClose,
  onUnsave,
  onExpandSources
}: SavedStoriesProps) {
  if (!isOpen) return null;
  // Group stories by date (mock - using timestamp for now)
  const groupedStories = stories.reduce((acc, story) => {
    const date = 'TODAY'; // In real app, would parse timestamp
    if (!acc[date]) acc[date] = [];
    acc[date].push(story);
    return acc;
  }, {} as Record<string, NewsStory[]>);
  return <div className="fixed inset-0 z-50 bg-white border-4 border-black overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-black">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            MY SAVED STORIES
          </h2>
          <button onClick={onClose} className="w-12 h-12 bg-black text-white text-2xl font-bold flex items-center justify-center border-4 border-black min-h-[44px] min-w-[44px]" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {stories.length === 0 ? <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <Bookmark className="w-16 h-16 md:w-20 md:h-20 mb-4 opacity-20" strokeWidth={3} />
              <h3 className="text-xl md:text-2xl font-bold mb-2" style={{
            fontFamily: 'Anton, sans-serif'
          }}>
                NO SAVED STORIES
              </h3>
              <p className="text-sm md:text-base opacity-60" style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700
          }}>
                Bookmark stories to read them later
              </p>
            </div> : Object.entries(groupedStories).map(([date, dateStories]) => <div key={date}>
                <div className="px-4 md:px-6 py-3 bg-black text-white text-xs md:text-sm font-bold tracking-widest border-b-4 border-black" style={{
            fontFamily: 'Anton, sans-serif'
          }}>
                  {date}
                </div>
                {dateStories.map(story => <div key={story.id} className="p-4 md:p-6 border-b-4 border-black">
                    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="px-2 md:px-3 py-1 bg-black text-white text-xs font-bold tracking-widest border-2 border-black flex-shrink-0" style={{
                fontFamily: 'Anton, sans-serif'
              }}>
                        {story.category}
                      </div>
                      <div className="text-xs md:text-sm font-bold tracking-widest opacity-40 flex-shrink-0" style={{
                fontFamily: 'Anton, sans-serif'
              }}>
                        {story.timestamp}
                      </div>
                    </div>

                    <h3 className="text-xl md:text-2xl leading-tight mb-2 md:mb-3" style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700
            }}>
                      {story.headline}
                    </h3>

                    <p className="text-sm md:text-base leading-relaxed mb-4 opacity-80" style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700
            }}>
                      {story.snippet}
                    </p>

                    <div className="flex gap-2 md:gap-3">
                      <button onClick={() => onExpandSources(story.id)} className="flex-1 px-4 py-3 bg-black text-white font-bold text-xs md:text-sm tracking-wider border-4 border-black flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors min-h-[44px]" style={{
                fontFamily: 'Anton, sans-serif'
              }}>
                        READ MORE
                        <ExternalLink className="w-4 h-4" strokeWidth={3} />
                      </button>
                      <button onClick={() => onUnsave(story.id)} className="px-4 py-3 bg-white border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors min-h-[44px] min-w-[44px]">
                        <Bookmark className="w-5 h-5" strokeWidth={3} fill="currentColor" />
                      </button>
                    </div>
                  </div>)}
              </div>)}
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(#808080 1px, transparent 1px), linear-gradient(90deg, #808080 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.1
        }} />
        </div>
      </div>
    </div>;
}