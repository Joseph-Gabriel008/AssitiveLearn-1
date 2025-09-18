import React, { useState } from 'react';
import { Brain, Languages, Lightbulb, RefreshCw } from 'lucide-react';
import { AIService } from '../utils/aiService';

interface AITextProcessorProps {
  darkMode: boolean;
  language: string;
}

export default function AITextProcessor({ darkMode, language }: AITextProcessorProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState<'simplify' | 'translate' | 'suggestions'>('simplify');

  const aiService = AIService.getInstance();

  const processText = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text first!');
      return;
    }

    setLoading(true);
    try {
      let result = '';
      
      switch (activeFeature) {
        case 'simplify':
          result = await aiService.simplifyText(inputText, language);
          break;
        case 'translate':
          result = await aiService.translateText(inputText, language);
          break;
        case 'suggestions':
          const suggestions = await aiService.generateStudySuggestions(inputText, 1);
          result = suggestions.join('\n• ');
          break;
      }
      
      setOutputText(result);
    } catch (error) {
      console.error('Error processing text:', error);
      setOutputText('Error processing text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFeatureInfo = () => {
    switch (activeFeature) {
      case 'simplify':
        return {
          title: 'Text Simplification',
          description: 'Make complex text easier to understand',
          placeholder: 'Enter complex text to simplify...'
        };
      case 'translate':
        return {
          title: 'Language Translation',
          description: `Translate text to ${language === 'hi' ? 'Hindi' : language === 'ta' ? 'Tamil' : 'Telugu'}`,
          placeholder: 'Enter English text to translate...'
        };
      case 'suggestions':
        return {
          title: 'Study Suggestions',
          description: 'Get AI-powered study recommendations',
          placeholder: 'Enter a subject or topic for study suggestions...'
        };
    }
  };

  const featureInfo = getFeatureInfo();

  return (
    <div className={`border rounded-lg p-4 ${
      darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
    }`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-500" />
        AI Learning Assistant
      </h3>

      {/* Feature Selection */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveFeature('simplify')}
          className={`px-3 py-2 rounded text-sm transition-colors ${
            activeFeature === 'simplify'
              ? 'bg-blue-500 text-white'
              : darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Lightbulb className="w-4 h-4 inline mr-1" />
          Simplify
        </button>
        <button
          onClick={() => setActiveFeature('translate')}
          className={`px-3 py-2 rounded text-sm transition-colors ${
            activeFeature === 'translate'
              ? 'bg-blue-500 text-white'
              : darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Languages className="w-4 h-4 inline mr-1" />
          Translate
        </button>
        <button
          onClick={() => setActiveFeature('suggestions')}
          className={`px-3 py-2 rounded text-sm transition-colors ${
            activeFeature === 'suggestions'
              ? 'bg-blue-500 text-white'
              : darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-1" />
          Suggestions
        </button>
      </div>

      {/* Feature Description */}
      <div className={`p-3 rounded-lg mb-4 ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <h4 className="font-medium">{featureInfo.title}</h4>
        <p className="text-sm text-gray-500">{featureInfo.description}</p>
      </div>

      {/* Input */}
      <div className="mb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={featureInfo.placeholder}
          className={`w-full p-3 border rounded-lg resize-none ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-black'
          }`}
          rows={4}
        />
      </div>

      {/* Process Button */}
      <button
        onClick={processText}
        disabled={loading}
        className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white px-4 py-2 rounded mb-4 flex items-center gap-2 transition-colors"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <Brain className="w-4 h-4" />
        )}
        {loading ? 'Processing...' : 'Process Text'}
      </button>

      {/* Output */}
      {outputText && (
        <div className={`p-3 border rounded-lg ${
          darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
        }`}>
          <h4 className="font-medium mb-2">Result:</h4>
          <div className="whitespace-pre-wrap">{outputText}</div>
        </div>
      )}
    </div>
  );
}