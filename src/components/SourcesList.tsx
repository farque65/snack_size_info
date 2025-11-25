import React from 'react';
import { NewsSource } from '../data/mockNews';
import { ExternalLink, X } from 'lucide-react';
interface SourcesListProps {
  sources: NewsSource[];
  isExpanded: boolean;
  onClose: () => void;
}
export function SourcesList({
  sources,
  isExpanded,
  onClose
}: SourcesListProps) {
  if (!isExpanded) return null;
  return <div className="fixed inset-0 z-50 bg-white border-4 border-black">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b-4 border-black">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            READ MORE
          </h2>
          <button onClick={onClose} className="w-12 h-12 bg-black text-white text-2xl font-bold flex items-center justify-center border-4 border-black min-h-[44px] min-w-[44px]" style={{
          fontFamily: 'Anton, sans-serif'
        }}>
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        {/* Sources List */}
        <div className="flex-1 overflow-y-auto">
          {sources.map((source, index) => <a key={index} href={source.url} target="_blank" rel="noopener noreferrer" className="block p-4 md:p-6 border-b-4 border-black hover:bg-black hover:text-white transition-colors min-h-[60px]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-widest mb-2 opacity-60" style={{
                fontFamily: 'Anton, sans-serif'
              }}>
                    {source.outlet}
                  </div>
                  <h3 className="text-base md:text-xl font-bold leading-tight" style={{
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                    {source.title}
                  </h3>
                </div>
                <ExternalLink className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-1" strokeWidth={3} />
              </div>
            </a>)}
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