import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Phrasebook = () => {
  const [phrases, setPhrases] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [playingAudio, setPlayingAudio] = useState(null);

  const languages = ['english', 'hindi', 'telugu', 'spanish'];
  const categories = ['emergency', 'travel', 'essentials'];

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/phrases');
        setPhrases(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching phrases:', err);
        setError('Failed to load phrases. Using offline data if available.');
        // Try to load from localStorage as fallback
        const cachedPhrases = localStorage.getItem('phrasebook');
        if (cachedPhrases) {
          setPhrases(JSON.parse(cachedPhrases));
        }
        setLoading(false);
      }
    };

    fetchPhrases();
  }, []);

  // Cache phrases in localStorage when available
  useEffect(() => {
    if (phrases && Object.keys(phrases).length > 0) {
      localStorage.setItem('phrasebook', JSON.stringify(phrases));
    }
  }, [phrases]);

  const playAudio = async (phrase) => {
    if (playingAudio) {
      playingAudio.pause();
    }

    try {
      // Get the audio file path for the selected language
      const audioFile = phrase.audio[selectedLanguage];
      
      // Create audio URL
      const audioUrl = `/api/phrases/audio/${audioFile}`;
      
      // Create and play audio
      const audio = new Audio(audioUrl);
      audio.onerror = () => {
        console.error(`Failed to load audio: ${audioUrl}`);
        // Fallback to browser's TTS if available
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(phrase[selectedLanguage]);
          const voices = window.speechSynthesis.getVoices();
          
          // Try to find a voice for the selected language
          let voice;
          switch(selectedLanguage) {
            case 'hindi':
              voice = voices.find(v => v.lang.includes('hi'));
              break;
            case 'spanish':
              voice = voices.find(v => v.lang.includes('es'));
              break;
            case 'telugu':
              voice = voices.find(v => v.lang.includes('te'));
              break;
            default:
              voice = voices.find(v => v.lang.includes('en'));
          }
          
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        }
      };
      
      audio.onended = () => {
        setPlayingAudio(null);
      };
      
      setPlayingAudio(audio);
      audio.play();
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && Object.keys(phrases).length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Multi-Language Phrasebook</h1>
      
      {/* Language Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Language:</h2>
        <div className="flex flex-wrap gap-2">
          {languages.map(language => (
            <button
              key={language}
              onClick={() => setSelectedLanguage(language)}
              className={`px-4 py-2 rounded-full ${
                selectedLanguage === language
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Category Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Phrases List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 capitalize">{selectedCategory} Phrases</h2>
        
        <div className="space-y-4">
          {phrases[selectedCategory]?.map((phrase, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{phrase[selectedLanguage]}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedLanguage !== 'english' && phrase.english}
                  </p>
                </div>
                <button
                  onClick={() => playAudio(phrase)}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Phrasebook;