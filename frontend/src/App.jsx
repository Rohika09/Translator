import React from 'react';
import Home from './components/Home';
import ARTranslator from './components/ARTranslator';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Home />
      <ARTranslator toLang="hi" />
    </div>
  );
}

export default App;
