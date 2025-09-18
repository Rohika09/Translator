import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import { FaExchangeAlt, FaMicrophone, FaVolumeUp, FaLanguage } from 'react-icons/fa';

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
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState('');
  const [conversationDirection, setConversationDirection] = useState('userToOther'); // 'userToOther' or 'otherToUser'

  // react-speech-recognition setup
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const getSpeechLang = () =>
    conversationDirection === 'userToOther' ? fromLang : toLang;

  const getTranslateFromLang = () =>
    conversationDirection === 'userToOther' ? fromLang : toLang;

  const getTranslateToLang = () =>
    conversationDirection === 'userToOther' ? toLang : fromLang;

  useEffect(() => {
    if (transcript) {
      setFromText(transcript);
    }
  }, [transcript]);

  const handleTranslate = async () => {
    setLoading(true);
    setError('');
    setTranslatedText('');
    try {
      const res = await axios.post('/api/translate', {
        text: fromText,
        fromLang: getTranslateFromLang(),
        toLang: getTranslateToLang(),
      });
      setTranslatedText(res.data.translatedText);
    } catch (err) {
      setError('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    setTtsLoading(true);
    setTtsError('');
    try {
      const res = await axios.post('/api/translate/speak', {
        text: translatedText,
        lang: getTranslateToLang(),
      });
      if (res.data.audio) {
        const audio = new Audio('data:audio/mp3;base64,' + res.data.audio);
        audio.play();
      } else {
        setTtsError('No audio received.');
      }
    } catch (err) {
      setTtsError('Speech failed.');
    } finally {
      setTtsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        <FaLanguage className="text-blue-600" /> Tourist Conversation Translator
      </h1>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">{conversationDirection === 'userToOther' ? 'You' : 'Other Person'}</span>
            <select
              className="border rounded p-2 text-sm"
              value={conversationDirection === 'userToOther' ? fromLang : toLang}
              onChange={e => {
                if (conversationDirection === 'userToOther') setFromLang(e.target.value);
                else setToLang(e.target.value);
              }}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <textarea
            className="w-full border rounded p-2 mb-2 text-base"
            rows={4}
            placeholder={conversationDirection === 'userToOther' ? 'Speak or type your message...' : 'Other person speaks or types here...'}
            value={fromText}
            onChange={e => setFromText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 rounded text-white flex items-center gap-2 ${listening ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-700 disabled:opacity-50`}
              type="button"
              onClick={() => {
                if (!listening) {
                  resetTranscript();
                  SpeechRecognition.startListening({ continuous: false, language: getSpeechLang() });
                } else {
                  SpeechRecognition.stopListening();
                }
              }}
              disabled={!browserSupportsSpeechRecognition}
              title="Start speaking"
            >
              <FaMicrophone /> {listening ? 'Stop' : 'Speak'}
            </button>
            <button
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              onClick={handleTranslate}
              disabled={loading || !fromText.trim()}
              title="Translate"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
          {!browserSupportsSpeechRecognition && (
            <span className="text-red-600 mt-2">Speech recognition not supported</span>
          )}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            className="bg-gray-200 px-4 py-2 rounded-full shadow flex items-center gap-2 text-lg hover:bg-gray-300"
            onClick={() =>
              setConversationDirection(
                conversationDirection === 'userToOther' ? 'otherToUser' : 'userToOther'
              )
            }
            title="Switch conversation direction"
          >
            <FaExchangeAlt className="text-blue-600" />
            {conversationDirection === 'userToOther'
              ? 'Other person speaks'
              : 'You speak'}
          </button>
          <div className="mt-2 text-sm text-gray-600 text-center max-w-xs">
            {conversationDirection === 'userToOther'
              ? 'You speak/type and get translation for the other person.'
              : 'Other person speaks/types and you get translation.'}
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg">{conversationDirection === 'userToOther' ? 'Other Person' : 'You'}</span>
            <select
              className="border rounded p-2 text-sm"
              value={conversationDirection === 'userToOther' ? toLang : fromLang}
              onChange={e => {
                if (conversationDirection === 'userToOther') setToLang(e.target.value);
                else setFromLang(e.target.value);
              }}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <div className="min-h-[48px] border rounded p-2 bg-gray-50 flex items-center justify-between">
            <span className="text-lg">{translatedText}</span>
            {translatedText && (
              <button
                className="ml-2 bg-green-600 text-white px-3 py-2 rounded-full hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                onClick={handleSpeak}
                disabled={ttsLoading}
                title="Play Speech"
              >
                <FaVolumeUp /> {ttsLoading ? 'Speaking...' : 'Listen'}
              </button>
            )}
          </div>
          {ttsError && <div className="text-red-600 mt-2">{ttsError}</div>}
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-6">
        <span>Powered by Google Translate API-X | Speech recognition by your browser</span>
      </div>
    </div>
  );
}
