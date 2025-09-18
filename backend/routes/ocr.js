// Express route for PDF/image upload and OCR
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import * as Tesseract from 'tesseract.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// POST /api/ocr/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    // Only handle image files for now (jpg, png, etc.)
    const imageTypes = ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (imageTypes.includes(ext)) {
      // Run OCR with Tesseract.js
      const result = await Tesseract.recognize(file.path, 'eng');
      // Clean up uploaded file
      fs.unlinkSync(file.path);
      return res.json({ text: result.data.text });
    } else {
      // For non-image files, just return file info for now
      fs.unlinkSync(file.path);
      return res.json({ message: 'File received (not an image, OCR not run)', filename: file.filename, originalname: file.originalname });
    }
  } catch (err) {
    res.status(500).json({ error: 'OCR failed', details: err.message });
  }
});

export default router;
