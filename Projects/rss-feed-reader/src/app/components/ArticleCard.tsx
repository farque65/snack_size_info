'use client';

import { FeedArticle } from '@/app/lib/types';

interface ArticleCardProps {
  article: FeedArticle;
}

export default function ArticleCard({ article }: ArticleCardProps): JSX.Element {
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Date unknown';
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleLinkMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.currentTarget.style.textDecoration = 'underline';
  };

  const handleLinkMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.currentTarget.style.textDecoration = 'none';
  };

  return (
    <article
      style={{
        border: '1px solid #e0e0e0',
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        transition: 'box-shadow 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#0070f3',
            textDecoration: 'none'
          }}
          onMouseEnter={handleLinkMouseEnter}
          onMouseLeave={handleLinkMouseLeave}
        >
          {article.title}
        </a>
      </h3>

      <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
        <span style={{ fontWeight: '500' }}>{article.source}</span>
        {' • '}
        <span>{formatDate(article.pubDate)}</span>
        {article.author && (
          <>
            {' • '}
            <span>By {article.author}</span>
          </>
        )}
      </div>

      <p style={{ margin: '0', color: '#333', lineHeight: '1.5' }}>
        {article.description}
      </p>

      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: '10px',
          color: '#0070f3',
          fontSize: '13px',
          textDecoration: 'none',
          fontWeight: '500'
        }}
        onMouseEnter={handleLinkMouseEnter}
        onMouseLeave={handleLinkMouseLeave}
      >
        Read More →
      </a>
    </article>
  );
}