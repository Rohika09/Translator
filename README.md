# Tourist Translator (MERN MVP)

A simple MERN stack MVP for text translation using the LibreTranslate API.

## Features
- React + Vite + TailwindCSS frontend
- Node.js + Express backend
- Text translation via LibreTranslate
- No database (MongoDB) for MVP

## Usage
1. Install dependencies in both `frontend` and `backend` folders.
2. Start backend: `npm run dev` (in `/backend`)
3. Start frontend: `npm run dev` (in `/frontend`)
4. Open the frontend URL (usually http://localhost:5173)

## Folder Structure
- `/frontend` – React app (Home screen for translation)
- `/backend` – Express server (translation API)

## API
- POST `/api/translate` – { text, fromLang, toLang }

## LibreTranslate
- [https://libretranslate.de/translate](https://libretranslate.de/translate)
