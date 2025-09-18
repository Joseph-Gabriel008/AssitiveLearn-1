import React, { useState, useEffect } from "react";
import { Globe, Settings, User, BookOpen, Target, Brain } from "lucide-react";
import NotesHighlighter from "./components/NotesHighlighter";
import Gamification from "./components/Gamification";
import StudyPlanner from "./components/StudyPlanner";
import VocabularyBuilder from "./components/VocabularyBuilder";
import AITextProcessor from "./components/AITextProcessor";
import { Note, UserProgress, StudyPlan, StudySession } from "./types";
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [listening, setListening] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('hi'); // Hindi by default
  const [activeTab, setActiveTab] = useState('home');

  // Data states
  const [notes, setNotes] = useState<Note[]>([]);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 50,
    streak: 3,
    totalStudyTime: 120, // minutes
    badges: [],
    studySessions: []
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('assistive-notes');
    const savedPlans = localStorage.getItem('assistive-plans');
    const savedProgress = localStorage.getItem('assistive-progress');
    
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedPlans) setStudyPlans(JSON.parse(savedPlans));
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('assistive-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('assistive-plans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  useEffect(() => {
    localStorage.setItem('assistive-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Text-to-Speech
  const speakText = () => {
    if (!speechText) {
      alert("Please enter some text first!");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ta' ? 'ta-IN' : 'te-IN';
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ta' ? 'ta-IN' : 'te-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpeechText(transcript);
    };

    recognition.start();
  };

  // Event handlers
  const handleSaveNote = (note: Note) => {
    setNotes(prev => [note, ...prev]);
    // Award XP for taking notes
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + 10
    }));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleCreatePlan = (plan: StudyPlan) => {
    setStudyPlans(prev => [plan, ...prev]);
    // Award XP for creating study plan
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + 25
    }));
  };

  const handleUpdateTask = (planId: string, taskId: string, completed: boolean) => {
    setStudyPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? {
            ...plan,
            tasks: plan.tasks.map(task => 
              task.id === taskId ? { ...task, completed } : task
            )
          }
        : plan
    ));
    
    if (completed) {
      // Award XP for completing task
      setUserProgress(prev => ({
        ...prev,
        xp: prev.xp + 15
      }));
    }
  };

  const handleWordMastered = (wordId: string) => {
    // Award XP for mastering vocabulary
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + 20
    }));
  };

  const handleClaimBadge = (badgeId: string) => {
    // Badge claiming logic would go here
    console.log('Claiming badge:', badgeId);
  };

  const languages = [
    { code: 'hi', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' }
  ];

  const tabs = [
    { id: 'home', name: 'Home', icon: '🏠' },
    { id: 'notes', name: 'Notes', icon: '📝' },
    { id: 'planner', name: 'Planner', icon: '📅' },
    { id: 'vocabulary', name: 'Vocabulary', icon: '📚' },
    { id: 'ai-tools', name: 'AI Tools', icon: '🤖' },
    { id: 'progress', name: 'Progress', icon: '🏆' }
  ];

  return (
    <div
      className={`${darkMode ? "bg-black text-white" : "bg-white text-black"} 
                  ${dyslexiaFont ? "font-mono" : ""} 
                  ${highContrast ? "contrast-200" : ""} min-h-screen transition-all duration-300`}
    >
      {/* Header */}
      <header className={`border-b p-4 ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-500" />
            <h1 className="text-2xl font-bold">Smart Learning Platform</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className={`px-3 py-1 border rounded ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-black'
                }`}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Accessibility Toggles */}
            <div className="flex gap-2">
              <button
                className={`p-2 rounded transition-colors ${
                  darkMode 
                    ? "bg-yellow-600 text-white" 
                    : "hover:bg-gray-100 border"
                }`}
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle Dark Mode"
              >
                {darkMode ? "🌞" : "🌙"}
              </button>
              <button
                className={`p-2 rounded transition-colors ${
                  dyslexiaFont 
                    ? "bg-purple-600 text-white" 
                    : "hover:bg-gray-100 border"
                }`}
                onClick={() => setDyslexiaFont(!dyslexiaFont)}
                title="Toggle Dyslexia Font"
              >
                🔤
              </button>
              <button
                className={`p-2 rounded transition-colors ${
                  highContrast 
                    ? "bg-red-600 text-white" 
                    : "hover:bg-gray-100 border"
                }`}
                onClick={() => setHighContrast(!highContrast)}
                title="Toggle High Contrast"
              >
                ⚡
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={`border-b ${
        darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? darkMode
                    ? 'border-b-2 border-blue-500 bg-gray-800 text-blue-400'
                    : 'border-b-2 border-blue-500 bg-white text-blue-600'
                  : darkMode
                  ? 'hover:bg-gray-800 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <section className={`border rounded-lg p-6 ${
              darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
            }`}>
              <h2 className="text-2xl font-bold mb-4">Welcome to Smart Learning! 👋</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Your AI-powered learning companion with support for Indian languages. 
                Track your progress, take notes, plan your studies, and build vocabulary.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <h3 className="font-bold mb-2">📝 Smart Notes</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Highlight text and add personal notes with AI assistance
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <h3 className="font-bold mb-2">🏆 Gamification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Earn XP, badges, and track your learning streak
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <h3 className="font-bold mb-2">🌐 Multi-language</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Learn in Hindi, Tamil, Telugu with AI translation
                  </p>
                </div>
              </div>
            </section>

            {/* Speech Tools */}
            <section className={`border rounded-lg p-4 ${
              darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
            }`}>
              <h3 className="text-lg font-bold mb-3">🔊 Speech Tools</h3>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Type or use microphone..."
                className={`w-full p-2 border rounded mb-3 resize-none ${
                  darkMode 
                    ? "text-white bg-gray-800 border-gray-600" 
                    : "text-black bg-white border-gray-300"
                }`}
                rows={4}
              />
              <div className="flex space-x-2">
                <button
                  onClick={speakText}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                >
                  ▶ Speak
                </button>
                <button
                  onClick={startListening}
                  className={`px-4 py-2 rounded text-white transition-colors flex items-center gap-2 ${
                    listening 
                      ? "bg-red-500 hover:bg-red-600" 
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={listening}
                >
                  🎤 {listening ? "Listening..." : "Start Speaking"}
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'notes' && (
          <NotesHighlighter
            darkMode={darkMode}
            language={currentLanguage}
            onSaveNote={handleSaveNote}
            notes={notes}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {activeTab === 'planner' && (
          <StudyPlanner
            darkMode={darkMode}
            studyPlans={studyPlans}
            onCreatePlan={handleCreatePlan}
            onUpdateTask={handleUpdateTask}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularyBuilder
            darkMode={darkMode}
            language={currentLanguage}
            onWordMastered={handleWordMastered}
          />
        )}

        {activeTab === 'ai-tools' && (
          <AITextProcessor
            darkMode={darkMode}
            language={currentLanguage}
          />
        )}

        {activeTab === 'progress' && (
          <Gamification
            darkMode={darkMode}
            userProgress={userProgress}
            onClaimBadge={handleClaimBadge}
          />
        )}
      </main>
    </div>
  );
}