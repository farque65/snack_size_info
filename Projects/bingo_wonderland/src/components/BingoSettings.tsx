import React, { useState } from 'react';
import type { BingoSettings as BingoSettingsType, CustomTemplate } from '../types/bingo';
import { validateItems } from '../utils/validation';
import { ItemInput } from './ItemInput';
import { TemplateSelector } from './TemplateSelector';

interface Props {
  settings: BingoSettingsType;
  onSettingsChange: (settings: BingoSettingsType) => void;
  customTemplates: CustomTemplate[];
  onCustomTemplateUpload: (url: string, name: string) => void;
  newCustomTemplate?: boolean;
}

export const BingoSettings: React.FC<Props> = ({ 
  settings, 
  onSettingsChange, 
  customTemplates,
  onCustomTemplateUpload,
  newCustomTemplate
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleItemsChange = (items: string[]) => {
    const validation = validateItems(items);
    setValidationErrors(validation.errors);
    onSettingsChange({ ...settings, customItems: items });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(5, Number(e.target.value)));
    onSettingsChange({ ...settings, numberOfCards: value });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, customMessage: e.target.value });
  };

  const handleTemplateChange = (templateId: string) => {
    const customTemplate = customTemplates.find(t => t.id === templateId);
    if (customTemplate) {
      onSettingsChange({ 
        ...settings, 
        templateBackground: templateId,
        customTemplateUrl: customTemplate.url 
      });
    } else {
      onSettingsChange({ ...settings, templateBackground: templateId });
    }
  };

  const handleCustomTemplateUpload = (url: string, name: string) => {
    onCustomTemplateUpload(url, name);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Message (appears at the top of each card)
        </label>
        <input
          type="text"
          value={settings.customMessage}
          onChange={handleMessageChange}
          placeholder="e.g., Let's have some fun!"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <TemplateSelector 
        selectedTemplate={settings.templateBackground}
        onTemplateChange={handleTemplateChange}
        onCustomTemplateUpload={handleCustomTemplateUpload}
        customTemplates={customTemplates}
        newCustomTemplate={newCustomTemplate}
      />

      <ItemInput
        value={settings.customItems}
        onChange={handleItemsChange}
        errors={validationErrors}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Cards (5-100)
        </label>
        <input
          type="number"
          min="5"
          max="100"
          value={settings.numberOfCards}
          onChange={handleNumberChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
    </div>
  );
};