import React from 'react';
import { Printer } from 'lucide-react';

interface Props {
  cardsPerPage: number;
  onChange: (value: number) => void;
}

export const PrintSettings: React.FC<Props> = ({ cardsPerPage, onChange }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Printer className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-800">Print Settings</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cards per Page
        </label>
        <select
          value={1}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-md cursor-not-allowed bg-gray-100"
          disabled
        >
          <option value={1}>1 card per page</option>
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Each bingo card will be printed on a separate page
        </p>
      </div>
    </div>
  );
};