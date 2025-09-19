import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmergencyPhrases = () => {
  const [phrases, setPhrases] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);

  const categories = Object.keys(phrases);
  const languages = ['english', 'hindi', 'telugu', 'spanish'];

  useEffect(() => {
    const fetchPhrases = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/phrases');
        setPhrases(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load phrases. Using offline data.');
        setPhrases({
          emergency: [
            { english: "Call the police!", hindi: "पुलिस को बुलाओ!", telugu: "పోలీసులను పిలవండి!", spanish: "¡Llama a la policía!" },
            { english: "Where is the hospital?", hindi: "अस्पताल कहाँ है?", telugu: "ఆసుపత్రి ఎక్కడ ఉంది?", spanish: "¿Dónde está el hospital?" },
          ],
          travel: [
            { english: "How much does this cost?", hindi: "यह कितने का है?", telugu: "ఇది ఎంత ఖరీదు?", spanish: "¿Cuánto cuesta esto?" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPhrases();
  }, []);

  const playAudio = (phrase) => {
    if (playingAudio) playingAudio.pause();

    try {
      const audio = new Audio(`/api/phrases/audio/${phrase.audio || ''}`);
      audio.onerror = () => {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(phrase[selectedLanguage]);
          const voices = window.speechSynthesis.getVoices();
          let voice;
          switch (selectedLanguage) {
            case 'hindi': voice = voices.find(v => v.lang.includes('hi')); break;
            case 'spanish': voice = voices.find(v => v.lang.includes('es')); break;
            case 'telugu': voice = voices.find(v => v.lang.includes('te')); break;
            default: voice = voices.find(v => v.lang.includes('en'));
          }
          if (voice) utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        }
      };
      audio.onended = () => setPlayingAudio(null);
      setPlayingAudio(audio);
      audio.play();
    } catch (err) {
      console.error('Audio error:', err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading phrases...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Emergency & Essential Phrases</h2>
      {error && <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">{error}</div>}

      <div className="mb-4">
        <label className="block mb-2">Category:</label>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Language:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value)}
        >
          {languages.map(lang => <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {phrases[selectedCategory]?.map((phrase, index) => (
          <div key={index} className="border rounded p-4 hover:shadow-md flex justify-between items-center">
            <div>
              <p className="font-medium">{phrase.english}</p>
              <p className="mt-1 text-lg">{phrase[selectedLanguage]}</p>
            </div>
            <button onClick={() => playAudio(phrase)} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
              🔊
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyPhrases;
