import express from 'express';
import { speak } from 'google-translate-api-x';

const router = express.Router();

// POST /api/translate/speak
router.post('/', async (req, res) => {
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
