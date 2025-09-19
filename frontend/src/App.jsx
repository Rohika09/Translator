import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import ARTranslator from './components/ARTranslator';
import EmergencyPhrases from './components/EmergencyPhrases';
import Phrasebook from './components/Phrasebook';
import CurrencyConverterPage from './components/CurrencyConverter';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on tab switch
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex space-x-4">
          {['home', 'translator', 'emergency', 'phrasebook', 'currency'].map(tab => (
            <button
              key={tab}
              className={`px-3 py-1 rounded ${activeTab === tab ? 'bg-white text-blue-600' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'currency' ? 'Currency Converter' : tab.charAt(0).toUpperCase() + tab.slice(1).replace('translator', 'Translator').replace('phrasebook','Phrasebook')}
            </button>
          ))}
        </div>
      </nav>

      <div className="container mx-auto p-4">
        {activeTab === 'home' && <Home />}
        {activeTab === 'translator' && <ARTranslator toLang="hi" />}
        {activeTab === 'emergency' && <EmergencyPhrases />}
        {activeTab === 'phrasebook' && <Phrasebook />}
        {activeTab === 'currency' && <CurrencyConverterPage />}
      </div>
    </div>
  );
}

export default App;
