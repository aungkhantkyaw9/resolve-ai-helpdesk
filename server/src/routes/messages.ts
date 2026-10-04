import { Router } from 'express';
import { z } from 'zod';
import type { GoogleGenAI } from '@google/genai';
import { toolDefinitions } from '../tools/definitions.js';
import { executeTool } from '../tools/execute.js';
import { retrievePolicy } from '../retrieval/retrieve.js';

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

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const send = (event: string, data: unknown) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
        };

        try {
            const policy = retrievePolicy(message);
            const systemInstruction = policy
                ? `You are a merchant support agent. Follow this policy document when relevant:\n\n${policy.content}`
                : 'You are a helpful merchant support agent.';

            if (policy) {
                send('trace', { type: 'policy_retrieved', doc: policy.title });
            }

            let interaction = await ai.interactions.create({
                model: 'gemini-3.8-flash',
                input: message,
                previous_interaction_id: previousInteractionId,
                tools: toolDefinitions as any,
                system_instruction: systemInstruction,
            })

            // Step 2: loop while the model keeps requesting tool calls
            let toolCallStep: any = interaction.steps.find((s: any) => s.type === 'function_call');

            while (toolCallStep) {
                send('trace', {
                    type: 'tool_call',
                    name: toolCallStep.name,
                    arguments: toolCallStep.arguments,
                });

                const result = executeTool(toolCallStep.name, toolCallStep.arguments);

                send('trace', {
                    type: 'tool_result',
                    name: toolCallStep.name,
                    result,
                });

                interaction = await ai.interactions.create({
                    model: 'gemini-3.8-flash',
                    input: [
                        {
                            type: 'function_result',
                            name: toolCallStep.name,
                            call_id: toolCallStep.id,
                            result: [{ type: 'text', text: JSON.stringify(result) }],
                        },
                    ],
                    tools: toolDefinitions as any,
                    previous_interaction_id: interaction.id,
                    system_instruction: systemInstruction
                });

                toolCallStep = interaction.steps.find((s: any) => s.type === 'function_call');
            }

            // Step 3: no more tool calls — stream the final text to the client in chunks
            const finalText = interaction.output_text ?? '';
            const words = finalText.split(' ');

            for (let i = 0; i < words.length; i += 3) {
                const chunk = words.slice(i, i + 3).join(' ') + ' ';
                send('token', { text: chunk });
                await new Promise((resolve) => setTimeout(resolve, 40)); // small delay for a readable typing effect
            }

            send('done', { interactionId: interaction.id });
            res.end();
        } catch (error) {
            console.error('[messages] Streaming failed:', error);
            send('error', { message: 'Something went wrong generating a response' });
            res.end();
        }
    });

    return router;
}
