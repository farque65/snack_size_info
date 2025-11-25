import React, { useEffect, useState, useRef } from 'react';
interface SwipeContainerProps {
  children: React.ReactNode[];
  onIndexChange?: (index: number) => void;
}
export function SwipeContainer({
  children,
  onIndexChange
}: SwipeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        onIndexChange?.(newIndex);
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, onIndexChange]);
  return <div ref={containerRef} className="h-screen w-full overflow-y-scroll snap-container" style={{
    scrollbarWidth: 'none',
    msOverflowStyle: 'none'
  }}>
      <style>{`
        .snap-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {children.map((child, index) => <div key={index} className="snap-item">
          {child}
        </div>)}
    </div>;
}