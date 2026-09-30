import { useState } from 'react';
import styles from './ChatThread.module.css';
import { mockMessages } from '../mockData';
import { useSendMessage } from '../hooks/useSendMessage';

export function ChatThread() {
    const { messages, sending, error, send } = useSendMessage(mockMessages);
    const [input, setInput] = useState('');

    function handleSend() {
        send(input);
        setInput('');
    }

    return (
        <div className={styles.pane}>
            <div className={styles.head}>
                <div>
                    <div className={styles.name}>Ploy S.</div>
                    <div className={styles.sub}>WhatsApp · Order #TH-88213</div>
                </div>
                <div className={styles.status}>{sending ? 'Agent is typing…' : 'Resolved by agent'}</div>
            </div>

            <div className={styles.messages}>
                {messages.map((m) => (
                    <div key={m.id} className={`${styles.msg} ${styles[m.from]}`}>
                        {m.from === 'agent' && <div className={styles.tag}>AI Agent</div>}
                        <div className={styles.bubble}>{m.text || '···'}</div>
                        <div className={styles.meta}>{m.time}</div>
                    </div>
                ))}
                {error && <div className={styles.error}>{error}</div>}
            </div>

            <div className={styles.composer}>
                <input
                    type="text"
                    placeholder="Type a message…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={sending}
                />
                <button onClick={handleSend} disabled={sending || !input.trim()}>
                    Send
                </button>
            </div>
        </div>
    );
}
