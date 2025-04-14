import React, { useState, useRef, useEffect } from 'react';
import { GiftIcon, Download, ImageDown, Printer, ChevronDown, ChevronUp, Grid, Loader2 } from 'lucide-react';
import { BingoSettings } from './components/BingoSettings';
import { BingoCardGrid } from './components/BingoCardGrid';
import { TopicInput } from './components/TopicInput';
import { ApiKeyInput } from './components/ApiKeyInput';
import { generateBingoCards } from './utils/bingo';
import { generateBingoItems } from './utils/openai';
import { downloadAllCardsAsImages } from './utils/download';
import type { BingoSettings as BingoSettingsType, BingoCard as BingoCardType, CustomTemplate } from './types/bingo';
import { Footer } from './components/Footer';

function App() {
  const [settings, setSettings] = useState<BingoSettingsType>({
    customItems: [],
    numberOfCards: 5,
    customMessage: '',
    cardsPerPage: 4,
    templateBackground: 'christmas'
  });

  const [cards, setCards] = useState<BingoCardType[]>([]);
  const [customTemplateUrl, setCustomTemplateUrl] = useState<string>('');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [settingsExpanded, setSettingsExpanded] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const cardsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [isCustomTemplate, setIsCustomTemplate] = useState<boolean>(false);

  useEffect(() => {
    const savedTemplates = localStorage.getItem('customBingoTemplates');
    if (savedTemplates) {
      try {
        setCustomTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error('Failed to parse saved templates', e);
      }
    }
  }, []);

  useEffect(() => {
    if (customTemplates.length > 0) {
      localStorage.setItem('customBingoTemplates', JSON.stringify(customTemplates));
    }
  }, [customTemplates]);

  const handleGenerateCards = () => {
    const generatedCards = generateBingoCards(settings.customItems, settings.numberOfCards);
    setCards(generatedCards);
    cardsRefs.current = new Array(generatedCards.length).fill(null);
  };

  const handleDownloadAll = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const validRefs = cardsRefs.current.filter((ref): ref is HTMLDivElement => ref !== null);
      if (validRefs.length > 0) {
        await downloadAllCardsAsImages(validRefs);
      } else {
        console.error('No valid card references found');
      }
    } catch (error) {
      console.error('Error downloading cards:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSettingsChange = (newSettings: BingoSettingsType) => {
    if (newSettings.templateBackground === 'custom' && newSettings.customTemplateUrl) {
      setCustomTemplateUrl(newSettings.customTemplateUrl);
    }
    setSettings(newSettings);
  };

  const handleCustomTemplateUpload = (url: string, name: string) => {
    const newTemplate: CustomTemplate = {
      id: `custom-${Date.now()}`,
      name: name || `Custom Template ${customTemplates.length + 1}`,
      url
    };
    
    const updatedTemplates = [...customTemplates, newTemplate];
    setCustomTemplates(updatedTemplates);
    
    // Automatically select the new template
    setSettings({
      ...settings,
      templateBackground: newTemplate.id,
      customTemplateUrl: url
    });
    setCustomTemplateUrl(url);
    
    return newTemplate.id;
  };

  const handleTopicSubmit = async (topic: string) => {
    setIsGenerating(true);
    // Collapse all sections
    setSettingsExpanded(false);
    setExpandedSections({});
    
    try {
      const response = await generateBingoItems(topic, apiKey);
      
      if (response.backgroundPrompt) {
        const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            prompt: response.backgroundPrompt,
            n: 1,
            size: '1024x1024',
            response_format: 'url',
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const imageUrl = imageData.data[0].url;
          
          const templateId = handleCustomTemplateUpload(imageUrl, `${response.title} Background`);
          
          setSettings(prev => ({
            ...prev,
            customItems: response.items,
            customMessage: response.message || response.title,
            templateBackground: templateId,
            customTemplateUrl: imageUrl
          }));

          setTimeout(() => {
            const newCards = generateBingoCards(response.items, settings.numberOfCards);
            setCards(newCards);
            setIsCustomTemplate(true);
            cardsRefs.current = new Array(newCards.length).fill(null);
          }, 100);
        } else {
          setSettings(prev => ({
            ...prev,
            customItems: response.items,
            customMessage: response.message || response.title
          }));
        }
      } else {
        setSettings(prev => ({
          ...prev,
          customItems: response.items,
          customMessage: response.message || response.title
        }));
      }
    } catch (error) {
      console.error('Error generating items:', error);
      alert('Failed to generate bingo items. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSettings = () => {
    setSettingsExpanded(!settingsExpanded);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white py-4 md:py-6 shadow-lg print:hidden border-b border-border">
        <div className="container mx-auto px-4">
          <a href="#" className="flex items-center space-x-2 group">
            <Grid className="h-6 w-6 md:h-8 md:w-8 text-primary animate-float" />
            <span className="text-lg md:text-xl font-bold text-charcoal group-hover:text-primary transition-colors">
              BINGO WONDERLAND
            </span>
          </a>
        </div>
      </header>

      {isGenerating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <h2 className="text-xl font-bold text-charcoal">BINGO WONDERLAND</h2>
              <p className="text-muted">is generating items...</p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="print:hidden">
          <ApiKeyInput onApiKeyChange={setApiKey} />
          <TopicInput 
            onTopicSubmit={handleTopicSubmit}
            isLoading={isGenerating}
            apiKey={apiKey}
          />
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4 md:mb-8">
            <button 
              onClick={toggleSettings}
              className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <h2 className="text-lg md:text-xl font-bold text-charcoal">Bingo Settings</h2>
              {settingsExpanded ? 
                <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-muted" /> : 
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-muted" />
              }
            </button>
            
            {settingsExpanded && (
              <div className="p-4 md:p-6">
                <BingoSettings 
                  settings={settings} 
                  onSettingsChange={handleSettingsChange} 
                  customTemplates={customTemplates}
                  onCustomTemplateUpload={handleCustomTemplateUpload}
                  newCustomTemplate={isCustomTemplate}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <button
              onClick={handleGenerateCards}
              className="w-full md:w-auto bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-hover transition-colors shadow-md hover:shadow-lg"
            >
              Generate Bingo Cards
            </button>
            
            {cards.length > 0 && (
              <>
                <button
                  onClick={handleDownloadAll}
                  disabled={isDownloading}
                  className={`w-full md:w-auto ${
                    isDownloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-success hover:bg-success-hover'
                  } text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2`}
                >
                  <ImageDown className="w-5 h-5" />
                  {isDownloading ? 'Preparing Download...' : 'Download All Cards'}
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-accent-hover transition-colors shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" />
                  Print Cards
                </button>
              </>
            )}
          </div>
        </div>

        {cards.length > 0 ? (
          <BingoCardGrid
            cards={cards}
            cardsPerPage={settings.cardsPerPage}
            customMessage={settings.customMessage}
            templateBackground={settings.templateBackground}
            customTemplateUrl={customTemplateUrl}
            customTemplates={customTemplates}
            refs={cardsRefs}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
          />
        ) : (
          <div className="text-center text-muted mt-6 md:mt-8 print:hidden">
            Click the generate button to create your bingo cards!
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;