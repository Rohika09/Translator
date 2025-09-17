const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { text, fromLang, toLang } = req.body;
  try {
    const response = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: fromLang,
      target: toLang,
      format: 'text',
    }, {
      headers: { 'accept': 'application/json' }
    });
    res.json({ translatedText: response.data.translatedText || response.data.translated_text });
  } catch (err) {
    res.status(500).json({ error: 'Translation failed.' });
  }
});

module.exports = router;
