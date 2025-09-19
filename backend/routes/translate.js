import express from 'express';
import { translate } from 'google-translate-api-x';

const router = express.Router();

// POST /api/translate
router.post('/', async (req, res) => {
  const { text, fromLang, toLang } = req.body;

  if (!text || !fromLang || !toLang) {
    return res.status(400).json({ error: 'Missing required fields: text, fromLang, toLang.' });
  }

  try {
    const result = await translate(text, { from: fromLang, to: toLang, client: 'gtx', autoCorrect: true });

    res.json({
      translatedText: result.text,
      detectedSourceLanguage: result.from.language.iso,
      didYouMean: result.from.text?.didYouMean ?? false,
      autoCorrected: result.from.text?.autoCorrected ?? false,
    });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.status(500).json({ error: 'Translation failed.' });
  }
});

export default router;
