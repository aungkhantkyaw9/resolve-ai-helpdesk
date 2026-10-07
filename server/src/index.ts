import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import { createMessagesRouter } from './routes/messages.js';

const app = express();
const PORT = process.env.PORT || 3001;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY is missing — check server/.env');

const ai = new GoogleGenAI({ apiKey });

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/messages', rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', createMessagesRouter(ai));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
