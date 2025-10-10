'use client';

import { FeedArticle, FeedCategory, FeedStats, SortOrder } from '@/app/lib/types';
import { useCallback, useState } from 'react';

interface UseFeedsReturn {
  articles: FeedArticle[];
  loading: boolean;
  error: string | null;
  stats: FeedStats | null;
  fetchFeeds: (category: FeedCategory, keywords?: string, limit?: number, sortBy?: SortOrder) => Promise<void>;
}

export function useFeeds(): UseFeedsReturn {
  const [articles, setArticles] = useState<FeedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FeedStats | null>(null);

  const fetchFeeds = useCallback(
    async (
      category: FeedCategory,
      keywords: string = '',
      limit: number = 20,
      sortBy: SortOrder = 'date'
    ): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const query = new URLSearchParams();
        query.append('category', category);
        if (keywords.trim()) query.append('keywords', keywords);
        query.append('limit', limit.toString());
        query.append('sortBy', sortBy);

        const res = await fetch(`/api/feeds?${query}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
        } else {
          setArticles(data.articles);
          setStats({
            total: data.total,
            filtered: data.filtered,
            returned: data.returned,
            errors: data.errors
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to fetch feeds: ${errorMessage}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { articles, loading, error, stats, fetchFeeds };
}