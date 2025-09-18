import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const phrasesPath = path.join(__dirname, '../data/phrases.json');

// Get all phrases
router.get('/', (req, res) => {
  try {
    const phrasesData = fs.readFileSync(phrasesPath, 'utf8');
    const phrases = JSON.parse(phrasesData);
    res.json(phrases);
  } catch (error) {
    console.error('Error reading phrases data:', error);
    res.status(500).json({ error: 'Failed to load phrases data' });
  }
});

// Get phrases by category
router.get('/:category', (req, res) => {
  try {
    const { category } = req.params;
    const phrasesData = fs.readFileSync(phrasesPath, 'utf8');
    const phrases = JSON.parse(phrasesData);
    
    if (!phrases[category]) {
      return res.status(404).json({ error: `Category '${category}' not found` });
    }
    
    res.json(phrases[category]);
  } catch (error) {
    console.error('Error reading phrases data:', error);
    res.status(500).json({ error: 'Failed to load phrases data' });
  }
});

// Get audio file for a phrase
router.get('/audio/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const audioPath = path.join(__dirname, '../data/audio', filename);
    
    // Check if file exists
    if (fs.existsSync(audioPath)) {
      res.sendFile(audioPath);
    } else {
      // If specific language file doesn't exist, try to find any available audio for this phrase
      const baseName = filename.split('_').slice(0, -1).join('_');
      const audioDir = path.join(__dirname, '../data/audio');
      
      const files = fs.readdirSync(audioDir);
      const fallbackFile = files.find(file => file.startsWith(baseName));
      
      if (fallbackFile) {
        res.sendFile(path.join(audioDir, fallbackFile));
      } else {
        res.status(404).json({ error: 'Audio file not found' });
      }
    }
  } catch (error) {
    console.error('Error serving audio file:', error);
    res.status(500).json({ error: 'Failed to serve audio file' });
  }
});

export default router;