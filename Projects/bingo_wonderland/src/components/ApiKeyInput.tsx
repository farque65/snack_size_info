import React, { useState } from 'react';
import { Key } from 'lucide-react';

interface Props {
  onApiKeyChange: (key: string) => void;
}

export const ApiKeyInput: React.FC<Props> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);
    onApiKeyChange(newKey);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Key className="w-5 h-5 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">
          OpenAI API Key
        </label>
      </div>
      <input
        type="password"
        value={apiKey}
        onChange={handleChange}
        placeholder="Enter your OpenAI API key"
        className="w-full px-3 py-2 border rounded-md"
      />
      <p className="text-xs text-gray-500 mt-1">
        Your API key is required to generate custom bingo items using ChatGPT
      </p>
    </div>
  );
};