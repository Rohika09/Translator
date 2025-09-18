import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyPhrases = () => {
  const [phrases, setPhrases] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/phrases');
        setPhrases(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching phrases:', err);
        setError('Failed to load phrases. Using offline data.');
        setLoading(false);
        
        // Fallback to local data if server is unavailable
        setPhrases({
          emergency: [
            {
              english: "Call the police!",
              hindi: "पुलिस को बुलाओ!",
              telugu: "పోలీసులను పిలవండి!",
              spanish: "¡Llama a la policía!"
            },
            {
              english: "Where is the hospital?",
              hindi: "अस्पताल कहाँ है?",
              telugu: "ఆసుపత్రి ఎక్కడ ఉంది?",
              spanish: "¿Dónde está el hospital?"
            }
          ],
          travel: [
            {
              english: "How much does this cost?",
              hindi: "यह कितने का है?",
              telugu: "ఇది ఎంత ఖరీదు?",
              spanish: "¿Cuánto cuesta esto?"
            }
          ]
        });
      }
    };

    fetchPhrases();
  }, []);

  const playAudio = async (audioFile) => {
    try {
      // In a real implementation, this would use the device's TTS or play a local audio file
      // For this demo, we'll try to fetch from the server but have a fallback
      const audio = new Audio(`/api/phrases/audio/${audioFile}`);
      
      audio.onerror = () => {
        console.error('Audio file not found or cannot be played');
        // Use browser's speech synthesis as fallback
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            phrases[selectedCategory].find(p => p.audio === audioFile)?.english || 'Phrase not found'
          );
          speechSynthesis.speak(utterance);
        }
      };
      
      audio.play();
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading phrases...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Emergency & Essential Phrases</h2>
      <p className="mb-4 text-gray-600">Access critical phrases without internet connectivity</p>
      
      {error && <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p>{error}</p>
      </div>}
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Category:</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(phrases).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded ${selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Language:</label>
        <select 
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="hindi">Hindi</option>
          <option value="telugu">Telugu</option>
          <option value="spanish">Spanish</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {phrases[selectedCategory]?.map((phrase, index) => (
          <div key={index} className="border rounded p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{phrase.english}</p>
                <p className="text-lg mt-1">{phrase[selectedLanguage]}</p>
              </div>
              <button 
                onClick={() => playAudio(phrase.audio)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
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
  );
};

export default EmergencyPhrases;