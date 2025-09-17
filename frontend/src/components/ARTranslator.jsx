
import React, { useRef, useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

const LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  // Add more as needed
];

export default function ARTranslator() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ocrText, setOcrText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [ocrWords, setOcrWords] = useState([]); // OCR words
  const [translatedWords, setTranslatedWords] = useState([]); // Translated words
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fallbackImg, setFallbackImg] = useState(null);
  const [toLang, setToLang] = useState('hi');
  const [capturedImg, setCapturedImg] = useState(null);
  const [boxes, setBoxes] = useState([]); // bounding boxes
  const [uploadedImg, setUploadedImg] = useState(null);

  // Start camera feed
  useEffect(() => {
    if (!fallbackImg) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(() => setError('Camera access denied.'));
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [fallbackImg]);

  // Removed auto OCR/translation interval. Now OCR/translation only runs on explicit capture or upload.
  // Handle image or PDF upload and send to backend for OCR
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    setUploadedImg(null);
    setCapturedImg(null);
    setFallbackImg(null);
    setBoxes([]);
    setOcrText('');
    setTranslatedText('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Send to backend OCR endpoint
      const res = await axios.post('/api/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // For now, just show file info or extracted text
      if (res.data.text) {
        setOcrText(res.data.text);
        // Optionally, auto-translate
        const tRes = await axios.post('/api/translate', {
          text: res.data.text,
          fromLang: 'auto',
          toLang,
        });
        setTranslatedText(tRes.data.translatedText);
      } else {
        setOcrText(res.data.message || 'No text extracted.');
        setTranslatedText('');
      }
    } catch (e) {
      setError('OCR or translation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Capture a still image from video and run OCR/translation
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setLoading(true);
    setError('');
    setCapturedImg(canvas.toDataURL('image/png'));
    try {
      const result = await Tesseract.recognize(canvas, 'eng');
      setOcrText(result.data.text);
      setOcrWords((result.data.words || []).map(word => word.text));
      const wordBoxes = (result.data.words || []).map(word => word.bbox);
      setBoxes(wordBoxes);
      if (result.data.text.trim()) {
        const res = await axios.post('/api/translate', {
          text: result.data.text,
          fromLang: 'auto',
          toLang,
        });
        setTranslatedText(res.data.translatedText);
        setTranslatedWords(res.data.translatedText.split(' '));
      } else {
        setTranslatedText('');
        setTranslatedWords([]);
      }
    } catch (e) {
      setError('OCR or translation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Fallback: load sample image and run OCR/translation
  const handleFallback = async () => {
    setFallbackImg('/sample-menu.jpg'); // Place a sample image in public folder
    setLoading(true);
    setError('');
    try {
      const { data: { text } } = await Tesseract.recognize('/sample-menu.jpg', 'eng');
      setOcrText(text);
      if (text.trim()) {
        const res = await axios.post('/api/translate', {
          text,
          fromLang: 'auto',
          toLang,
        });
        setTranslatedText(res.data.translatedText);
      } else {
        setTranslatedText('');
      }
    } catch (e) {
      setError('OCR or translation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">AR Translator</h2>
      {/* Language selection dropdown */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="toLang" className="font-semibold">Translate to:</label>
        <select
          id="toLang"
          value={toLang}
          onChange={e => setToLang(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      <div className="relative">
        {/* Global translation overlay at the top */}
        {translatedText && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded text-lg z-20">
            {translatedText}
          </div>
        )}
        {fallbackImg ? (
          <img src={fallbackImg} alt="Sample" className="w-full rounded" />
        ) : uploadedImg ? (
          <div className="relative w-full">
            <img src={uploadedImg} alt="Uploaded" className="w-full rounded" />
            {boxes.map((box, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(box.x0 / (canvasRef.current?.width || 1)) * 100}%`,
                  top: `${(box.y0 / (canvasRef.current?.height || 1)) * 100}%`,
                  width: `${((box.x1 - box.x0) / (canvasRef.current?.width || 1)) * 100}%`,
                  height: `${((box.y1 - box.y0) / (canvasRef.current?.height || 1)) * 100}%`,
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1em',
                  fontWeight: 600,
                  pointerEvents: 'none',
                  zIndex: 30,
                  border: '2px solid #00ff00',
                }}
              >
                {translatedWords[i] || ''}
              </div>
            ))}
          </div>
        ) : capturedImg ? (
          <div className="relative w-full">
            <img src={capturedImg} alt="Captured" className="w-full rounded" />
            {boxes.map((box, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(box.x0 / (canvasRef.current?.width || 1)) * 100}%`,
                  top: `${(box.y0 / (canvasRef.current?.height || 1)) * 100}%`,
                  width: `${((box.x1 - box.x0) / (canvasRef.current?.width || 1)) * 100}%`,
                  height: `${((box.y1 - box.y0) / (canvasRef.current?.height || 1)) * 100}%`,
                  border: '2px solid #00ff00',
                  pointerEvents: 'none',
                  zIndex: 30,
                }}
              />
            ))}
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline className="w-full rounded" />
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {/* AR Overlay */}
        {/* Remove global overlay, now each word is overlaid in its box */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {/* Scan button for manual OCR/translation */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleCapture}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      </div>
      <div className="mt-4 flex gap-2 items-center">
        <button onClick={() => { setCapturedImg(null); setUploadedImg(null); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Resume Live
        </button>
        <button onClick={handleFallback} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
          Demo with Sample Image
        </button>
        <label className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 cursor-pointer">
          Upload Image/PDF
          <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {loading
          ? 'Detecting and translating...'
          : ocrText && (
            <>
              <div>Detected: {ocrText}</div>
              {translatedText && (
                <div className="mt-2 text-green-700 font-semibold">Translated: {translatedText}</div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
