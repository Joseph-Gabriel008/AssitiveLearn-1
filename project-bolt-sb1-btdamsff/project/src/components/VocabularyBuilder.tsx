import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, Star, RefreshCw, Brain } from 'lucide-react';
import { VocabularyWord } from '../types';
import { AIService } from '../utils/aiService';

interface VocabularyBuilderProps {
  darkMode: boolean;
  language: string;
  onWordMastered: (wordId: string) => void;
}

export default function VocabularyBuilder({ 
  darkMode, 
  language, 
  onWordMastered 
}: VocabularyBuilderProps) {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const aiService = AIService.getInstance();

  useEffect(() => {
    loadVocabulary();
  }, [language, difficulty]);

  const loadVocabulary = async () => {
    setLoading(true);
    try {
      const vocabData = await aiService.generateVocabulary(language, difficulty);
      const vocabularyWords: VocabularyWord[] = vocabData.map((item, index) => ({
        id: `${language}-${index}`,
        word: item.word,
        meaning: item.meaning,
        language,
        pronunciation: item.pronunciation,
        example: item.example,
        difficulty,
        mastered: false
      }));
      setWords(vocabularyWords);
      setCurrentWordIndex(0);
      setShowMeaning(false);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'te-IN';
    window.speechSynthesis.speak(utterance);
  };

  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
    setShowMeaning(false);
  };

  const markAsMastered = () => {
    if (words[currentWordIndex]) {
      const word = words[currentWordIndex];
      onWordMastered(word.id);
      setWords(prev => prev.map(w => 
        w.id === word.id ? { ...w, mastered: true } : w
      ));
      nextWord();
    }
  };

  const currentWord = words[currentWordIndex];
  const masteredCount = words.filter(w => w.mastered).length;

  if (loading) {
    return (
      <div className={`border rounded-lg p-4 ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
      }`}>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          Loading vocabulary...
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg p-4 ${
      darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Vocabulary Builder
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className={`px-3 py-1 border rounded text-sm ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-black'
            }`}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={loadVocabulary}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Progress: {masteredCount}/{words.length} words mastered</span>
          <span>{words.length > 0 ? Math.round((masteredCount / words.length) * 100) : 0}%</span>
        </div>
        <div className={`w-full h-2 rounded-full ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
            style={{ width: `${words.length > 0 ? (masteredCount / words.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {currentWord ? (
        <div className="text-center">
          {/* Word Card */}
          <div className={`p-6 rounded-lg mb-4 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <h2 className="text-3xl font-bold">{currentWord.word}</h2>
              <button
                onClick={() => speakWord(currentWord.word)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            
            {currentWord.pronunciation && (
              <p className="text-gray-500 mb-3">/{currentWord.pronunciation}/</p>
            )}

            <div className="space-y-2 mb-4">
              <button
                onClick={() => setShowMeaning(!showMeaning)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
              >
                {showMeaning ? 'Hide Meaning' : 'Show Meaning'}
              </button>
            </div>

            {showMeaning && (
              <div className="space-y-3">
                <div className={`p-3 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <p className="font-medium text-green-600 mb-2">Meaning:</p>
                  <p>{currentWord.meaning}</p>
                </div>
                
                <div className={`p-3 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <p className="font-medium text-blue-600 mb-2">Example:</p>
                  <p className="italic">"{currentWord.example}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={nextWord}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
            >
              Skip
            </button>
            {showMeaning && (
              <button
                onClick={markAsMastered}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <Star className="w-4 h-4" />
                Mastered!
              </button>
            )}
          </div>

          {/* Word Counter */}
          <p className="text-sm text-gray-500 mt-4">
            Word {currentWordIndex + 1} of {words.length}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No vocabulary words available.</p>
          <button
            onClick={loadVocabulary}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3 transition-colors"
          >
            Load Words
          </button>
        </div>
      )}
    </div>
  );
}