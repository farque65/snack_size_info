// src/app/page.tsx
'use client';

import ArticleCard from '@/app/components/ArticleCard';
import CategorySelector from '@/app/components/CategorySelector';
import FeedFilter from '@/app/components/FeedFilter';
import { useFeeds } from '@/app/hooks/useFeeds';
import { FeedCategory } from '@/app/lib/types';
import { useEffect, useState } from 'react';

// Keyword groups for AI products
const KEYWORD_GROUPS = {
  'Product Launches': 'AI product launch,new AI tool,AI startup announcement,AI release,AI platform launch,GPT-4,GPT-5,Claude 3,Gemini 2,Llama 3',
  'Popular Products': 'ChatGPT,Claude,Gemini,GPT-4,Llama,generative AI,AI startup,AI tool',
  'Open Source': 'Llama,Mistral,open source AI,Hugging Face,model release,foundation model',
  'AI Startups': 'AI startup,AI company,AI funding,venture capital AI,AI acquisition,AI IPO',
  'AI Tools & Services': 'AI tool,AI product,AI app,AI platform,AI software,AI service,AI solution',
  'Generative AI': 'generative AI,foundation model,LLM,large language model,GPT,Claude,Gemini,text generation,image generation',
  'Code & Development': 'code generation,coding AI,GitHub Copilot,AI developer,programming AI,code completion',
  'Computer Vision': 'computer vision,image recognition,object detection,image generation,text-to-image,vision model',
  'Business & Enterprise': 'business AI,enterprise AI,workplace AI,productivity AI,workflow automation,corporate automation',
  'Comprehensive': 'AI,artificial intelligence,machine learning,deep learning,ChatGPT,Claude,Gemini,GPT,LLM,generative AI,AI startup,AI product,AI innovation,automation',
};

type KeywordGroupName = keyof typeof KEYWORD_GROUPS;

interface GeminiResult {
  title: string;
  description: string;
  relevance: string;
}

export default function Home(): JSX.Element {
  const [category, setCategory] = useState<FeedCategory>('tech');
  const [keywords, setKeywords] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<KeywordGroupName | null>(null);
  const [showRssOutput, setShowRssOutput] = useState<boolean>(true);
  const [geminiResults, setGeminiResults] = useState<GeminiResult[]>([]);
  const [geminiLoading, setGeminiLoading] = useState<boolean>(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const { articles, loading, error, stats, fetchFeeds } = useFeeds();

  useEffect(() => {
    void fetchFeeds(category);
  }, [category, fetchFeeds]);

  const handleKeywordGroupClick = (groupName: KeywordGroupName): void => {
    const groupKeywords = KEYWORD_GROUPS[groupName];
    setKeywords(groupKeywords);
    setSelectedGroup(groupName);
  };

  const handleSearch = (): void => {
    void fetchFeeds(category, keywords);
  };

  const handleKeywordChange = (newKeywords: string): void => {
    setKeywords(newKeywords);
    setSelectedGroup(null);
  };

  const fetchGeminiResults = async (): Promise<void> => {
    if (!articles || articles.length === 0) {
      setGeminiError('No articles to analyze. Please search first.');
      return;
    }

    setGeminiLoading(true);
    setGeminiError(null);
    setGeminiResults([]);

    try {
      // Create a summary of articles for Gemini
      const articleSummary = articles
        .slice(0, 10) // Use top 10 articles to stay within token limits
        .map((article, idx) => `${idx + 1}. ${article.title}: ${article.description}`)
        .join('\n');

      const prompt = `Based on these AI-related news articles, identify and list the top 5 most important and refined insights about new AI products, trends, or developments. For each insight, provide:
1. A clear title
2. A brief description of what's happening
3. Why it's relevant or important

Articles:
${articleSummary}

Please format your response as a JSON array with objects containing "title", "description", and "relevance" fields.`;

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          articles: articles.slice(0, 10),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        setGeminiError(data.error);
      } else if (data.results) {
        setGeminiResults(data.results);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setGeminiError(`Failed to fetch Gemini results: ${errorMessage}`);
      console.error('Gemini API error:', err);
    } finally {
      setGeminiLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', fontSize: '32px' }}>
          📰 RSS Feed Reader
        </h1>
        <p style={{ color: '#666', margin: 0 }}>
          Stay updated with news from multiple sources
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <CategorySelector value={category} onChange={setCategory} />
        <div /> 
      </div>

      {/* Keyword Groups Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            Quick Keyword Groups
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {(Object.keys(KEYWORD_GROUPS) as KeywordGroupName[]).map((groupName) => (
              <button
                key={groupName}
                onClick={() => handleKeywordGroupClick(groupName)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: selectedGroup === groupName 
                    ? '2px solid #0070f3' 
                    : '1px solid #ddd',
                  backgroundColor: selectedGroup === groupName 
                    ? '#f0f7ff' 
                    : '#fff',
                  color: selectedGroup === groupName 
                    ? '#0070f3' 
                    : '#333',
                  fontSize: '13px',
                  fontWeight: selectedGroup === groupName ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (selectedGroup !== groupName) {
                    e.currentTarget.style.borderColor = '#0070f3';
                    e.currentTarget.style.color = '#0070f3';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedGroup !== groupName) {
                    e.currentTarget.style.borderColor = '#ddd';
                    e.currentTarget.style.color = '#333';
                  }
                }}
              >
                {groupName}
              </button>
            ))}
          </div>
          {selectedGroup && (
            <div style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#f0f7ff',
              borderRadius: '4px',
              fontSize: '13px',
              color: '#0070f3'
            }}>
              Selected: <strong>{selectedGroup}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div style={{ marginBottom: '32px' }}>
        <FeedFilter
          keywords={keywords}
          onKeywordChange={handleKeywordChange}
          onSubmit={handleSearch}
          loading={loading}
        />
      </div>

      {error && (
        <div style={{
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#fee',
          borderLeft: '4px solid #f00',
          borderRadius: '4px',
          color: '#c00'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Toggle RSS Output Button */}
      {articles.length > 0 && (
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowRssOutput(!showRssOutput)}
            style={{
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#f0f0f0',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
            }}
          >
            {showRssOutput ? '📖 Collapse RSS Output' : '📖 Show RSS Output'}
          </button>
        </div>
      )}

      {/* RSS Output Section */}
      {showRssOutput && (
        <>
          {stats && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#333'
            }}>
              Showing <strong>{stats.returned}</strong> of <strong>{stats.filtered}</strong> filtered articles
              {stats.filtered !== stats.total && ` (from ${stats.total} total)`}
              {stats.errors && ` • ${stats.errors.length} feed(s) failed to load`}
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <p>Loading articles...</p>
            </div>
          )}

          {!loading && articles.length === 0 && !error && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
              <p>No articles found. Try adjusting your filters.</p>
            </div>
          )}

          <div>
            {articles.map((article) => (
              <ArticleCard key={article.guid} article={article} />
            ))}
          </div>

          {articles.length === 0 && !loading && !error && stats && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#999',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              marginTop: '20px'
            }}>
              <p>No articles match your search criteria.</p>
              <p style={{ fontSize: '14px' }}>Try using different keywords or selecting another category.</p>
            </div>
          )}
        </>
      )}

      {/* Gemini AI Refinement Section */}
      {articles.length > 0 && (
        <div style={{
          marginTop: '48px',
          paddingTop: '32px',
          borderTop: '2px solid #e0e0e0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px' }}>
              🤖 AI-Powered Insights
            </h2>
            <button
              onClick={() => void fetchGeminiResults()}
              disabled={geminiLoading}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: '#0070f3',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: geminiLoading ? 'not-allowed' : 'pointer',
                opacity: geminiLoading ? 0.6 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!geminiLoading) {
                  e.currentTarget.style.backgroundColor = '#0051cc';
                }
              }}
              onMouseLeave={(e) => {
                if (!geminiLoading) {
                  e.currentTarget.style.backgroundColor = '#0070f3';
                }
              }}
            >
              {geminiLoading ? 'Analyzing...' : 'Refine with AI'}
            </button>
          </div>

          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Uses Google Gemini AI to analyze the articles above and extract key insights and trends.
          </p>

          {geminiError && (
            <div style={{
              padding: '16px',
              marginBottom: '20px',
              backgroundColor: '#fee',
              borderLeft: '4px solid #f00',
              borderRadius: '4px',
              color: '#c00'
            }}>
              <strong>Error:</strong> {geminiError}
            </div>
          )}

          {geminiLoading && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#666'
            }}>
              <p>🤔 Analyzing articles with Gemini AI...</p>
              <p style={{ fontSize: '13px', color: '#999' }}>This may take a moment...</p>
            </div>
          )}

          {geminiResults.length > 0 && (
            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              {geminiResults.map((result, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    borderLeft: '4px solid #0070f3'
                  }}
                >
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    color: '#0070f3',
                    fontWeight: '600'
                  }}>
                    {idx + 1}. {result.title}
                  </h3>
                  <p style={{
                    margin: '8px 0',
                    fontSize: '14px',
                    color: '#333',
                    lineHeight: '1.5'
                  }}>
                    {result.description}
                  </p>
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#e8f4fd',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: '#0051cc'
                  }}>
                    <strong>Relevance:</strong> {result.relevance}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!geminiLoading && geminiResults.length === 0 && !geminiError && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              color: '#999'
            }}>
              <p>Click "Refine with AI" to analyze the articles and extract key insights.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}