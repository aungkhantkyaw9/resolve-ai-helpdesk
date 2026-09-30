import { Router } from 'express';
import { z } from 'zod';
import type { GoogleGenAI } from '@google/genai';

const messageRequestSchema = z.object({
    message: z.string().min(1).max(2000),
    previousInteractionId: z.string().optional(),
});

export function createMessagesRouter(ai: GoogleGenAI) {
    const router = Router();

    const messageRequestSchema = z.object({
        message: z.string().min(1).max(2000),
        previousInteractionId: z.string().optional(),
    });

    router.post('/messages', async (req, res) => {
        const parsed = messageRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
        }

        const { message, previousInteractionId } = parsed.data;

        // SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const send = (event: string, data: unknown) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        try {
            const stream = await ai.interactions.create({
                model: 'gemini-3.8-flash',
                input: message,
                previous_interaction_id: previousInteractionId,
                stream: true,
            });

            let interactionId: string | undefined;

            for await (const event of stream) {
                if (event.event_type === 'interaction.created') {
                    interactionId = event.interaction?.id;
                }

                if (event.event_type === 'step.delta' && event.delta?.type === 'text') {
                    send('token', { text: event.delta.text });
                }
            }

            send('done', { interactionId });
            res.end();
        } catch (error) {
            console.error('Streaming failed:', error);
            send('error', { message: 'Something went wrong generating a response' });
            res.end();
        }
    });

    return router;
}
