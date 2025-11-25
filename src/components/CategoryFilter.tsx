import React from 'react';
interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}
export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory
}: CategoryFilterProps) {
  return <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black">
      <div className="flex overflow-x-auto" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }}>
        <style>{`
          .category-filter::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <button onClick={() => onSelectCategory(null)} className={`px-4 md:px-6 py-3 md:py-4 font-bold text-xs md:text-sm tracking-wider border-r-4 border-black whitespace-nowrap min-h-[44px] ${activeCategory === null ? 'bg-black text-white' : 'bg-white text-black'}`} style={{
        fontFamily: 'Anton, sans-serif'
      }}>
          ALL
        </button>
        {categories.map(category => <button key={category} onClick={() => onSelectCategory(category)} className={`px-4 md:px-6 py-3 md:py-4 font-bold text-xs md:text-sm tracking-wider border-r-4 border-black whitespace-nowrap min-h-[44px] ${activeCategory === category ? 'bg-black text-white' : 'bg-white text-black'}`} style={{
        fontFamily: 'Anton, sans-serif'
      }}>
            {category}
          </button>)}
      </div>
    </div>;
}