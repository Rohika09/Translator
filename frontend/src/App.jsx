import React, { useState } from 'react';
import Home from './components/Home';
import ARTranslator from './components/ARTranslator';
import EmergencyPhrases from './components/EmergencyPhrases';
import Phrasebook from './components/Phrasebook';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex space-x-4">
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'home' ? 'bg-white text-blue-600' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'translator' ? 'bg-white text-blue-600' : ''}`}
            onClick={() => setActiveTab('translator')}
          >
            Translator
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'emergency' ? 'bg-white text-blue-600' : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            Emergency Phrases
          </button>
          <button 
            className={`px-3 py-1 rounded ${activeTab === 'phrasebook' ? 'bg-white text-blue-600' : ''}`}
            onClick={() => setActiveTab('phrasebook')}
          >
            Phrasebook
          </button>
        </div>
      </nav>
      
      <div className="container mx-auto p-4">
        {activeTab === 'home' && <Home />}
        {activeTab === 'translator' && <ARTranslator toLang="hi" />}
        {activeTab === 'emergency' && <EmergencyPhrases />}
        {activeTab === 'phrasebook' && <Phrasebook />}
      </div>
    </div>
  );
}

export default App;
