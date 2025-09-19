import express from 'express';
import { speak } from 'google-translate-api-x';

const router = express.Router();
const LANGUAGES = ['en','hi','es','fr','de','zh','ar'];

router.post('/', async (req, res) => {
  const { text, lang } = req.body;
  if (!text || !lang) return res.status(400).json({ error: 'Missing fields' });
  if (!LANGUAGES.includes(lang)) return res.status(400).json({ error: 'Unsupported language' });

  try {
    const audioBase64 = await speak(text, { to: lang });
    res.json({ audio: audioBase64 });
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'TTS failed' });
  }
});

export default router;
