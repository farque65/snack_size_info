import React, { useState } from 'react';
import { SwipeContainer } from './components/SwipeContainer';
import { NewsCard } from './components/NewsCard';
import { SourcesList } from './components/SourcesList';
import { CategoryFilter } from './components/CategoryFilter';
import { Footer } from './components/Footer';
import { SavedStories } from './components/SavedStories';
import { mockNews, NewsStory } from './data/mockNews';
export function App() {
  const [stories, setStories] = useState<NewsStory[]>(mockNews);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);
  const [savedStoriesOpen, setSavedStoriesOpen] = useState(false);
  const categories = Array.from(new Set(mockNews.map(story => story.category)));
  const filteredStories = activeCategory ? stories.filter(story => story.category === activeCategory) : stories;
  const savedStories = stories.filter(story => story.saved);
  const handleToggleLike = (id: string) => {
    setStories(prev => prev.map(story => story.id === id ? {
      ...story,
      liked: !story.liked
    } : story));
  };
  const handleToggleSave = (id: string) => {
    setStories(prev => prev.map(story => story.id === id ? {
      ...story,
      saved: !story.saved
    } : story));
  };
  const expandedStory = stories.find(s => s.id === expandedStoryId);
  return <div className="relative w-full h-screen bg-white overflow-hidden">
      <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      <div className="pt-14 md:pt-16 pb-20 md:pb-24 h-full">
        <SwipeContainer>
          {filteredStories.map(story => <NewsCard key={story.id} story={story} onToggleLike={() => handleToggleLike(story.id)} onToggleSave={() => handleToggleSave(story.id)} onExpandSources={() => setExpandedStoryId(story.id)} />)}
        </SwipeContainer>
      </div>

      <Footer savedCount={savedStories.length} onOpenSaved={() => setSavedStoriesOpen(true)} />

      {expandedStory && <SourcesList sources={expandedStory.sources} isExpanded={!!expandedStoryId} onClose={() => setExpandedStoryId(null)} />}

      <SavedStories stories={savedStories} isOpen={savedStoriesOpen} onClose={() => setSavedStoriesOpen(false)} onUnsave={handleToggleSave} onExpandSources={setExpandedStoryId} />
    </div>;
}