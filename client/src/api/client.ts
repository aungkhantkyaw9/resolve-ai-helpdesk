export interface StreamCallbacks {
    onToken: (text: string) => void;
    onTrace: (data: {
        type: 'tool_call' | 'tool_result' | 'policy_retrieved';
        name?: string;
        arguments?: unknown;
        result?: unknown;
        doc?: string;
    }) => void;
    onDone: (interactionId?: string) => void;
    onError: (message: string) => void;
}

const API_URL = 'http://localhost:3001'; // TODO: move to env var when we deploy (KAN-10)

export async function sendMessage(
    message: string,
    previousInteractionId: string | undefined,
    callbacks: StreamCallbacks
) {
    const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, previousInteractionId }),
    });

    if (!response.ok || !response.body) {
        callbacks.onError('Failed to connect to the server');
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const rawEvent of events) {
            const lines = rawEvent.split('\n');
            const eventLine = lines.find((l) => l.startsWith('event: '));
            const dataLine = lines.find((l) => l.startsWith('data: '));
            if (!eventLine || !dataLine) continue;

            const eventType = eventLine.replace('event: ', '').trim();
            const data = JSON.parse(dataLine.replace('data: ', ''));

            if (eventType === 'token') callbacks.onToken(data.text);
            if (eventType === 'done') callbacks.onDone(data.interactionId);
            if (eventType === 'error') callbacks.onError(data.message);
            if (eventType === 'trace') callbacks.onTrace(data);
        }
    }
}
