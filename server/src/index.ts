import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing — check server/.env');
}

const ai = new GoogleGenAI({ apiKey });

// Middleware
app.use(cors());
app.use(express.json());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 50, // generous for solo testing, tight enough to protect the free quota
    })
);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/test-gemini', async (_req, res) => {
    try {
        const interaction = await ai.interactions.create({
            model: 'gemini-3.8-flash',
            input: 'Reply with exactly one sentence confirming you received this test message.',
        });

        res.json({ reply: interaction.output_text });
    } catch (error) {
        console.error('Gemini call failed:', error);
        res.status(500).json({ error: 'Failed to reach Gemini API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
