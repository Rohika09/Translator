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
      } catch (err) {
        console.error(err);
        setError('Failed to load phrases. Using offline fallback.');
        setPhrases({
          emergency: [
            { english: "Call the police!", hindi: "पुलिस को बुलाओ!", telugu: "పోలీసులను పిలవండి!", spanish: "¡Llama a la policía!" }
          ],
          travel: [
            { english: "How much does this cost?", hindi: "यह कितने का है?", telugu: "ఇది ఎంత ఖరీదు?", spanish: "¿Cuánto cuesta esto?" }
          ],
          essentials: [
            { english: "I need water.", hindi: "मुझे पानी चाहिए।", telugu: "నాకు నీరు కావాలి.", spanish: "Necesito agua." }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPhrases();
  }, []);

  useEffect(() => {
    if (phrases && Object.keys(phrases).length) {
      localStorage.setItem('phrasebook', JSON.stringify(phrases));
    }
  }, [phrases]);

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
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Multi-Language Phrasebook</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Language:</h2>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <button key={lang} onClick={() => setSelectedLanguage(lang)}
              className={`px-4 py-2 rounded-full ${selectedLanguage===lang?'bg-blue-600 text-white':'bg-gray-200 hover:bg-gray-300'}`}>{lang.charAt(0).toUpperCase()+lang.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Select Category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full ${selectedCategory===cat?'bg-green-600 text-white':'bg-gray-200 hover:bg-gray-300'}`}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-4 capitalize">{selectedCategory} Phrases</h2>
        <div className="space-y-4">
          {phrases[selectedCategory]?.map((phrase,index)=>(
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{phrase[selectedLanguage]}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedLanguage!=='english'?phrase.english:''}</p>
              </div>
              <button onClick={()=>playAudio(phrase)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2">🔊</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Phrasebook;
