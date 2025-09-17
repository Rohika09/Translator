// Backend OCR utility integration for PDF/image upload
// Place this file as backend/ocrUtils.js

import { detectPDFType } from './detectPDFType.js';
import { extract } from './extract.js';
import {
  check,
  conf,
  debug,
  evalInternal, overlay, recognize,
} from './main.js';

export async function extractTextFromPDF(inputFile, outputDir = '.', options = {}) {
  await extract(inputFile, outputDir, options);
}

export async function detectType(pdfFile, outputPath) {
  await detectPDFType(pdfFile, outputPath);
}

// Add more wrappers as needed for your backend OCR API
