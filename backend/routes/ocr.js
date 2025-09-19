import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Tesseract from 'tesseract.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/ocr/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const imageTypes = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (imageTypes.includes(ext)) {
      const result = await Tesseract.recognize(file.path, 'eng');
      fs.unlinkSync(file.path);
      return res.json({ text: result.data.text });
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: 'Uploaded file is not an image' });
    }
  } catch (err) {
    console.error('OCR error:', err.message);
    res.status(500).json({ error: 'OCR failed', details: err.message });
  }
});

export default router;
