export interface FeedArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  content?: string;
  author?: string;
  guid: string;
  image?: string | null;
}

export interface FeedResponse {
  category: string;
  total: number;
  filtered: number;
  returned: number;
  articles: FeedArticle[];
  errors?: FeedError[] | null;
}

export interface FeedError {
  feed: string;
  error: string;
}

export interface FeedStats {
  total: number;
  filtered: number;
  returned: number;
  errors?: FeedError[] | null;
}

export type FeedCategory = 'tech' | 'business' | 'science' | 'health';

export type SortOrder = 'date' | 'title';