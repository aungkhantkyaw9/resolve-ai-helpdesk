import { useState } from 'react';
import { sendMessage } from '../../../api/client';
import type { Message } from '../../../shared/types/message';
import type { TraceStep } from '../../../shared/types/trace';

let nextMsgId = 100;
let nextTraceId = 1;

export function useSendMessage(initialMessages: Message[]) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [interactionId, setInteractionId] = useState<string | undefined>();

    async function send(text: string) {
        if (!text.trim() || sending) return;

        const customerMsg: Message = { id: nextMsgId++, from: 'customer', text, time: nowLabel() };
        const agentMsgId = nextMsgId++;
        const agentPlaceholder: Message = { id: agentMsgId, from: 'agent', text: '', time: nowLabel() };

        setMessages((prev) => [...prev, customerMsg, agentPlaceholder]);
        setTraceSteps([]); // reset trace for this new turn
        setSending(true);
        setError(null);

        let anyToolUsed = false;

        await sendMessage(text, interactionId, {
            onToken: (chunk) => {
                setMessages((prev) =>
                    prev.map((m) => (m.id === agentMsgId ? { ...m, text: m.text + chunk } : m))
                );
            },
            onTrace: (data) => {
                anyToolUsed = true;
                if (data.type === 'tool_call') {
                    setTraceSteps((prev) => [
                        ...prev,
                        {
                            id: nextTraceId++,
                            icon: '🔍',
                            label: `${prev.length + 1} · Tool call`,
                            content: `${data.name}(${formatArgs(data.arguments)})`,
                            done: true,
                        },
                    ]);
                } else if (data.type === 'tool_result') {
                    setTraceSteps((prev) => [
                        ...prev,
                        {
                            id: nextTraceId++,
                            icon: '📦',
                            label: `${prev.length + 1} · Result`,
                            content: formatResult(data.result),
                            done: true,
                            result: true,
                        },
                    ]);
                }
            },
            onDone: (id) => {
                setInteractionId(id);
                setTraceSteps((prev) => [
                    ...prev,
                    {
                        id: nextTraceId++,
                        icon: '✅',
                        label: `${prev.length + 1} · Replied to customer`,
                        content: anyToolUsed ? 'Sent response using tool results' : 'Replied directly — no tools needed',
                        done: true,
                    },
                ]);
                setSending(false);
            },
            onError: (message) => {
                setError(message);
                setSending(false);
            },
        });
    }

    return { messages, traceSteps, sending, error, send };
}

function nowLabel() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatArgs(args: unknown): string {
    if (!args || typeof args !== 'object') return '';
    return Object.entries(args as Record<string, unknown>)
        .map(([k, v]) => `${k}="${v}"`)
        .join(', ');
}

function formatResult(result: unknown): string {
    if (!result || typeof result !== 'object') return String(result);
    return Object.entries(result as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
}
