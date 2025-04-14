import { Check, ImageIcon, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { CustomTemplate } from '../types/bingo';
import { getTemplateCategories, getTemplatesByCategory } from '../utils/templates';

interface Props {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  onCustomTemplateUpload: (url: string, name: string) => void;
  customTemplates: CustomTemplate[];
  newCustomTemplate?: boolean;
}

export const TemplateSelector: React.FC<Props> = ({ 
  selectedTemplate, 
  onTemplateChange,
  onCustomTemplateUpload,
  customTemplates,
  newCustomTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('holiday');
  const [templateName, setTemplateName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState<boolean>(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = getTemplateCategories();

  useEffect(() => {
    if (newCustomTemplate) {
      setActiveCategory('custom');
    }
  }, [newCustomTemplate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempImageUrl(event.target.result as string);
          setShowNameInput(true);
          setTemplateName(`Custom Template ${customTemplates.length + 1}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCustomTemplate = () => {
    if (tempImageUrl) {
      onCustomTemplateUpload(tempImageUrl, templateName);
      setShowNameInput(false);
      setTempImageUrl('');
      setTemplateName('');
    }
  };

  const cancelCustomTemplate = () => {
    setShowNameInput(false);
    setTempImageUrl('');
    setTemplateName('');
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Card Background Template
      </label>
      
      {showNameInput && (
        <div className="bg-gray-50 p-4 rounded-lg border mb-4">
          <h3 className="font-medium mb-2">Name your template</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-16 h-16 rounded overflow-hidden">
              <img src={tempImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name"
              className="flex-1 px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={cancelCustomTemplate}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveCustomTemplate}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-md capitalize ${
              activeCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
        {customTemplates.length > 0 && (
          <button
            onClick={() => setActiveCategory('custom')}
            className={`px-4 py-2 rounded-md capitalize ${
              activeCategory === 'custom'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            My Templates
          </button>
        )}
        <button
          onClick={triggerFileUpload}
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {activeCategory === 'custom' ? (
          // Display custom templates
          customTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-green-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={template.url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {selectedTemplate === template.id && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-2 bg-white">
                <p className="text-sm font-medium">{template.name}</p>
              </div>
            </div>
          ))
        ) : (
          // Display default templates by category
          getTemplatesByCategory(activeCategory).map(template => (
            <div
              key={template.id}
              onClick={() => onTemplateChange(template.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedTemplate === template.id
                  ? 'border-green-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {template.url ? (
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={template.url}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              )}
              <div className="p-2 bg-white">
                <p className="text-sm font-medium">{template.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};