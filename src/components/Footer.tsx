import React from 'react';
import { Bookmark } from 'lucide-react';
interface FooterProps {
  savedCount: number;
  onOpenSaved: () => void;
}
export function Footer({
  savedCount,
  onOpenSaved
}: FooterProps) {
  return <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-black">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="text-xs md:text-sm font-bold tracking-widest opacity-40" style={{
        fontFamily: 'Anton, sans-serif'
      }}>
          SWIPE UP FOR MORE
        </div>

        <button onClick={onOpenSaved} className="px-4 md:px-6 py-3 bg-black text-white font-bold text-xs md:text-sm tracking-wider border-4 border-black flex items-center gap-2 hover:bg-white hover:text-black transition-colors min-h-[44px]" style={{
        fontFamily: 'Anton, sans-serif'
      }}>
          <Bookmark className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} fill="currentColor" />
          MY SAVED ({savedCount})
        </button>
      </div>
    </div>;
}