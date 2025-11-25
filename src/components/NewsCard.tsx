import React from 'react';
import { Heart, Bookmark, ChevronUp } from 'lucide-react';
import { NewsStory } from '../data/mockNews';
interface NewsCardProps {
  story: NewsStory;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onExpandSources: () => void;
}
export function NewsCard({
  story,
  onToggleLike,
  onToggleSave,
  onExpandSources
}: NewsCardProps) {
  return <div className="h-screen w-full bg-white border-4 border-black relative overflow-hidden flex flex-col">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full" style={{
        backgroundImage: 'linear-gradient(#808080 1px, transparent 1px), linear-gradient(90deg, #808080 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        opacity: 0.05
      }} />
      </div>

      {/* Content - scrollable if needed, with bottom padding for footer */}
      <div className="relative flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-36">
        {/* Category badge */}
        <div className="mb-4 md:mb-8">
          <div className="inline-block px-3 md:px-4 py-2 bg-black text-white text-xs font-bold tracking-widest border-4 border-black" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            {story.category}
          </div>
        </div>

        {/* Headline */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-none tracking-tight mb-4 md:mb-8" style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700
        }}>
            {story.headline}
          </h1>

          {/* Snippet */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 md:mb-8 max-w-3xl" style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 700
        }}>
            {story.snippet}
          </p>

          {/* Timestamp */}
          <div className="text-xs md:text-sm font-bold tracking-widest opacity-40" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            {story.timestamp}
          </div>
        </div>

        {/* Actions bar - positioned within content area, above footer */}
        <div className="flex items-center justify-between border-t-4 border-black pt-4 md:pt-6 mt-6 md:mt-8 bg-white">
          <div className="flex gap-2 md:gap-4">
            <button onClick={onToggleLike} className="w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors min-h-[44px] min-w-[44px]">
              <Heart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} fill={story.liked ? 'currentColor' : 'none'} />
            </button>
            <button onClick={onToggleSave} className="w-12 h-12 md:w-14 md:h-14 bg-white border-4 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors min-h-[44px] min-w-[44px]">
              <Bookmark className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} fill={story.saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <button onClick={onExpandSources} className="px-4 md:px-6 py-3 bg-black text-white font-bold text-xs md:text-sm tracking-wider border-4 border-black flex items-center gap-2 hover:bg-white hover:text-black transition-colors min-h-[44px]" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            READ MORE
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>;
}