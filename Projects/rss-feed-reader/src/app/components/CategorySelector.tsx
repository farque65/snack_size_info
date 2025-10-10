'use client';

import { CATEGORIES, CATEGORY_LABELS } from '@/app/lib/feedConfig';
import { FeedCategory } from '@/app/lib/types';

interface CategorySelectorProps {
  value: FeedCategory;
  onChange: (category: FeedCategory) => void;
}

export default function CategorySelector({ value, onChange }: CategorySelectorProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.target.value as FeedCategory);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label htmlFor="category" style={{ fontWeight: '500' }}>
        Category
      </label>
      <select 
        id="category"
        value={value} 
        onChange={handleChange}
        style={{
          padding: '10px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
          cursor: 'pointer',
          backgroundColor: '#fff'
        }}
      >
        {CATEGORIES.map((cat: FeedCategory) => (
          <option key={cat} value={cat}>
            {CATEGORY_LABELS[cat]}
          </option>
        ))}
      </select>
    </div>
  );
}