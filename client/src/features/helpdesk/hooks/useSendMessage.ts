import { useState } from 'react';
import { sendMessage } from '../../../api/client';
import type { Message } from '../../../shared/types/message';

let nextId = 100; // mock messages use 1-4, start real ones higher to avoid key collisions

export function useSendMessage(initialMessages: Message[]) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [interactionId, setInteractionId] = useState<string | undefined>();

    async function send(text: string) {
        if (!text.trim() || sending) return;

        const customerMsg: Message = { id: nextId++, from: 'customer', text, time: nowLabel() };
        const agentMsgId = nextId++;
        const agentPlaceholder: Message = { id: agentMsgId, from: 'agent', text: '', time: nowLabel() };

        setMessages((prev) => [...prev, customerMsg, agentPlaceholder]);
        setSending(true);
        setError(null);

        await sendMessage(text, interactionId, {
            onToken: (chunk) => {
                setMessages((prev) =>
                    prev.map((m) => (m.id === agentMsgId ? { ...m, text: m.text + chunk } : m))
                );
            },
            onDone: (id) => {
                setInteractionId(id);
                setSending(false);
            },
            onError: (message) => {
                setError(message);
                setSending(false);
            },
        });
    }

    return { messages, sending, error, send };
}

function nowLabel() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
