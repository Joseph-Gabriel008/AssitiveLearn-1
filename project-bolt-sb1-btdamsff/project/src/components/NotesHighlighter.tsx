import React, { useState, useRef } from 'react';
import { Highlighter, Save, Trash2 } from 'lucide-react';
import { Note } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface NotesHighlighterProps {
  darkMode: boolean;
  language: string;
  onSaveNote: (note: Note) => void;
  notes: Note[];
  onDeleteNote: (id: string) => void;
}

export default function NotesHighlighter({ 
  darkMode, 
  language, 
  onSaveNote, 
  notes, 
  onDeleteNote 
}: NotesHighlighterProps) {
  const [selectedText, setSelectedText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [subject, setSubject] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  };

  const saveNote = () => {
    if (!noteText.trim() || !selectedText.trim()) {
      alert('Please select text and add a note!');
      return;
    }

    const newNote: Note = {
      id: uuidv4(),
      text: noteText,
      highlight: selectedText,
      timestamp: new Date(),
      subject: subject || 'General',
      language
    };

    onSaveNote(newNote);
    setNoteText('');
    setSelectedText('');
    setSubject('');
  };

  return (
    <div className={`border rounded-lg p-4 ${
      darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
    }`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Highlighter className="w-5 h-5" />
        Notes & Highlights
      </h3>

      {/* Text Selection Area */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select text to highlight:
        </label>
        <textarea
          ref={textAreaRef}
          onMouseUp={handleTextSelection}
          className={`w-full p-3 border rounded-lg resize-none ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-black'
          }`}
          rows={4}
          placeholder="Paste or type text here, then select parts to highlight..."
          defaultValue="Education is the most powerful weapon which you can use to change the world. It is through education that the daughter of a peasant can become a doctor, that the son of a mineworker can become the head of the mine."
        />
      </div>

      {selectedText && (
        <div className={`p-3 rounded-lg mb-4 ${
          darkMode ? 'bg-yellow-900 border-yellow-600' : 'bg-yellow-100 border-yellow-400'
        } border`}>
          <p className="text-sm font-medium">Selected Text:</p>
          <p className="italic">"{selectedText}"</p>
        </div>
      )}

      {/* Note Input */}
      <div className="space-y-3 mb-4">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
          className={`w-full p-2 border rounded ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-black'
          }`}
        />
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add your note here..."
          className={`w-full p-2 border rounded resize-none ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-black'
          }`}
          rows={3}
        />
        <button
          onClick={saveNote}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Note
        </button>
      </div>

      {/* Saved Notes */}
      <div className="space-y-3">
        <h4 className="font-medium">Saved Notes ({notes.length})</h4>
        {notes.length === 0 ? (
          <p className="text-gray-500 text-sm">No notes saved yet.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded border ${
                  darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-blue-500 font-medium">
                    {note.subject} • {note.timestamp.toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className={`text-xs p-2 rounded mb-2 ${
                  darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                }`}>
                  <strong>Highlight:</strong> "{note.highlight}"
                </div>
                <p className="text-sm">{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}