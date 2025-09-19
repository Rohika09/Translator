import express from 'express';
import { translate, speak } from 'google-translate-api-x';

const router = express.Router();

// Translation endpoint
router.post('/', async (req, res) => {
  const { text, fromLang, toLang } = req.body;

  if (!text || !fromLang || !toLang) {
    return res.status(400).json({ error: 'Missing required fields: text, fromLang, toLang.' });
  }

  try {
    const result = await translate(text, {
      from: fromLang,
      to: toLang,
      client: 'gtx',
      autoCorrect: true,
    });

    res.json({
      translatedText: result.text,
      detectedSourceLanguage: result.from.language.iso,
      didYouMean: result.from.text?.didYouMean ?? false,
      autoCorrected: result.from.text?.autoCorrected ?? false,
      value: result.from.text?.value ?? null,
    });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.status(500).json({ error: 'Translation failed.' });
  }
});

// TTS endpoint
router.post('/speak', async (req, res) => {
  const { text, lang } = req.body;

  if (!text || !lang) {
    return res.status(400).json({ error: 'Missing required fields: text, lang.' });
  }

  try {
    const audioBase64 = await speak(text, { to: lang });
    res.json({ audio: audioBase64 });
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'TTS failed.' });
  }
});

export default router;


