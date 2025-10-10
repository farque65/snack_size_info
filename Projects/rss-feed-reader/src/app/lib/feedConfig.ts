import { FeedCategory } from './types';

export const RSS_FEEDS: Record<FeedCategory, string[]> = {
  tech: [
    'https://feeds.arstechnica.com/arstechnica/index',
    'https://news.ycombinator.com/rss',
    'https://www.theverge.com/rss/index.xml',
    'https://feeds.wired.com/wired/index'
  ],
  business: [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://feeds.reuters.com/reuters/businessNews',
    'https://feeds.cnbc.com/id/100003114/device/rss/rss.html'
  ],
  science: [
    'https://feeds.nature.com/nature/rss/current',
    'https://www.sciencedaily.com/rss/all.xml',
    'https://feeds.arstechnica.com/arstechnica/science'
  ],
  health: [
    'https://feeds.health.com/health.xml',
    'https://feeds.webmd.com/webmd_health'
  ]
};

export const CATEGORIES: FeedCategory[] = Object.keys(RSS_FEEDS) as FeedCategory[];

export const CATEGORY_LABELS: Record<FeedCategory, string> = {
  tech: 'Technology',
  business: 'Business',
  science: 'Science',
  health: 'Health'
};