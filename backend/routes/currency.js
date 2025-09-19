import express from 'express';
import axios from 'axios';

const router = express.Router();

// POST /api/currency/convert
router.post('/convert', async (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const response = await axios.get(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
    if (response.data && response.data.rates && response.data.rates[to] !== undefined) {
      res.json({ result: response.data.rates[to] });
    } else {
      res.status(500).json({ error: 'Conversion failed.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching conversion rate.' });
  }
});

export default router;
