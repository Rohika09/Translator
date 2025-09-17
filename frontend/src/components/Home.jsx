import React, { useState } from 'react';
import axios from 'axios';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  // Add more as needed
];

export default function Home() {
  const [fromText, setFromText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setTranslatedText('');
    try {
      const res = await axios.post('/api/translate', {
        text: fromText,
        fromLang,
        toLang,
      });
      setTranslatedText(res.data.translatedText);
    } catch (err) {
      setError('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tourist Translator</h1>
      <textarea
        className="w-full border rounded p-2 mb-3"
        rows={4}
        placeholder="Enter text to translate..."
        value={fromText}
        onChange={e => setFromText(e.target.value)}
      />
      <div className="flex gap-2 mb-3">
        <select
          className="border rounded p-2 flex-1"
          value={fromLang}
          onChange={e => setFromLang(e.target.value)}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
        <span className="self-center">→</span>
        <select
          className="border rounded p-2 flex-1"
          value={toLang}
          onChange={e => setToLang(e.target.value)}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleTranslate}
        disabled={loading || !fromText.trim()}
      >
        {loading ? 'Translating...' : 'Translate'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <div className="mt-4">
        <label className="block font-semibold mb-1">Translation:</label>
        <div className="min-h-[48px] border rounded p-2 bg-gray-50">
          {translatedText}
        </div>
      </div>
    </div>
  );
}
