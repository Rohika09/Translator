import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

import translateRouter from './routes/translate.js';
import ocrRouter from './routes/ocr.js';
import phrasesRouter from './routes/phrases.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/translate', translateRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/phrases', phrasesRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
