import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  value: string[];
  onChange: (items: string[]) => void;
  errors: string[];
}

export const ItemInput: React.FC<Props> = ({ value, onChange, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const items = text
      .split(/[\n,]/) // Split by newline or comma
      .map(item => item.trim())
      .filter(item => item.length > 0);
    onChange(items);
  };

  // Convert array of items to newline-separated string
  const displayValue = value.join('\n');

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Custom Items
      </label>
      <textarea
        value={displayValue}
        onChange={handleChange}
        placeholder="Enter up to 40 items, separated by commas or new lines"
        className={`w-full h-32 px-3 py-2 border rounded-md font-mono ${
          errors.length > 0 ? 'border-red-500' : 'border-gray-300'
        }`}
        style={{ resize: 'vertical', minHeight: '8rem', maxHeight: '16rem' }}
      />
      {errors.length > 0 && (
        <div className="text-red-500 text-sm">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500">Enter up to 40 items. Separate items with commas or new lines.</p>
    </div>
  );
};