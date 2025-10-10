import { RSS_FEEDS } from '@/app/lib/feedConfig';
import { FeedArticle, FeedCategory, FeedError, FeedResponse, SortOrder } from '@/app/lib/types';
import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'media']],
  }
});

interface ParserItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  description?: string;
  pubDate?: string;
  content?: string;
  creator?: string;
  guid?: string;
  media?: Array<{ $?: string }>;
}

interface ParserFeed {
  title?: string;
  items?: ParserItem[];
}

export async function GET(request: NextRequest): Promise<NextResponse<FeedResponse | { error: string; message?: string }>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = (searchParams.get('category') || 'tech') as FeedCategory;
    const keywords = searchParams.get('keywords')?.split(',') || [];
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sortBy = (searchParams.get('sortBy') || 'date') as SortOrder;

    // Validate category
    if (!(category in RSS_FEEDS)) {
      const availableCategories = Object.keys(RSS_FEEDS).join(', ');
      return NextResponse.json(
        { 
          error: `Category '${category}' not found. Available: ${availableCategories}` 
        },
        { status: 400 }
      );
    }

    const feeds = RSS_FEEDS[category];
    const allArticles: FeedArticle[] = [];
    const errors: FeedError[] = [];

    // Fetch from all feeds in parallel
    const fetchPromises = feeds.map(async (feedUrl: string) => {
      try {
        const feed = await parser.parseURL(feedUrl) as ParserFeed;
        
        feed.items?.forEach((item: ParserItem) => {
          allArticles.push({
            title: item.title || 'Untitled',
            link: item.link || '',
            description: item.contentSnippet || item.description || '',
            pubDate: item.pubDate || new Date().toISOString(),
            source: feed.title || 'Unknown Source',
            content: item.content,
            author: item.creator,
            guid: item.guid || item.link || `${Math.random()}`,
            image: item.media?.[0]?.$ || null
          });
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        errors.push({
          feed: feedUrl,
          error: errorMessage
        });
        console.error(`Error parsing feed ${feedUrl}:`, errorMessage);
      }
    });

    await Promise.allSettled(fetchPromises);

    // Filter by keywords
    let filtered = allArticles;
    if (keywords.length > 0 && keywords[0]?.trim()) {
      filtered = allArticles.filter((article: FeedArticle) => {
        const text = `${article.title} ${article.description}`.toLowerCase();
        return keywords.some((keyword: string) => 
          text.includes(keyword.toLowerCase().trim())
        );
      });
    }

    // Sort articles
    const sorted = filtered
      .sort((a: FeedArticle, b: FeedArticle) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      })
      .slice(0, limit);

    const response: FeedResponse = {
      category,
      total: allArticles.length,
      filtered: filtered.length,
      returned: sorted.length,
      articles: sorted,
      errors: errors.length > 0 ? errors : null
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Feed API error:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Failed to fetch feeds', 
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}