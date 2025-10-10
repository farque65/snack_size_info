'use client';

interface FeedFilterProps {
  keywords: string;
  onKeywordChange: (keywords: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function FeedFilter({
  keywords,
  onKeywordChange,
  onSubmit,
  loading
}: FeedFilterProps): JSX.Element {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onKeywordChange(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label htmlFor="keywords" style={{ fontWeight: '500' }}>
          Filter Keywords
        </label>
        <input
          id="keywords"
          type="text"
          placeholder="Enter keywords separated by commas (e.g., AI, machine learning)"
          value={keywords}
          onChange={handleInputChange}
          style={{
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
        <small style={{ color: '#666' }}>
          Leave empty to show all articles
        </small>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#0070f3',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>
    </form>
  );
}