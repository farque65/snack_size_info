import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface Props {
  onTopicSubmit: (topic: string) => Promise<void>;
  isLoading: boolean;
  apiKey: string;
}

export const TopicInput: React.FC<Props> = ({ onTopicSubmit, isLoading, apiKey }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    if (!apiKey) {
      alert('Please enter your OpenAI API key first');
      return;
    }
    await onTopicSubmit(topic);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your event or topic (e.g., 'Baby Shower', 'Office Party')"
          className="flex-1 px-3 py-2 border rounded-md"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            isLoading || !topic.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Generate Items
            </>
          )}
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-1">
        Enter a topic to automatically generate relevant bingo items using AI
      </p>
    </div>
  );
};