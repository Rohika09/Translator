// backend/server.js
import express from 'express';
import cors from 'cors';
import ocrRoutes from './routes/ocr.js';
import phrasesRoutes from './routes/phrases.js';
import translateRoutes from './routes/translate.js';
import ttsRoutes from './routes/tts.js';
import currencyRoutes from './routes/currency.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ocr', ocrRoutes);
app.use('/api/phrases', phrasesRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/translate/speak', ttsRoutes);
app.use('/api/currency', currencyRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Tourist Translator Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
