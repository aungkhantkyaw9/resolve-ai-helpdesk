import styles from './ChatThread.module.css'

const messages = [
    {
        id: 1,
        from: 'customer',
        text: 'Hi, where\'s my order? It\'s been 5 days and I haven\'t received anything 😕',
        time: '10:14'
    },
    {id: 2, from: 'agent', text: 'Checking that for you now — one moment.', time: '10:14'},
    {
        id: 3,
        from: 'agent',
        text: 'Your order #TH-88213 shipped on Sep 18 and is currently out for delivery — it\'s expected today by 6pm. Here\'s the tracking: TH88213SF. Let me know if it doesn\'t arrive!',
        time: '10:14'
    },
    {id: 4, from: 'customer', text: 'Oh perfect, thank you!', time: '10:16'}
]

export function ChatThread() {
    return (
        <div className={styles.pane}>
            <div className={styles.head}>
                <div>
                    <div className={styles.name}>Ploy S.</div>
                    <div className={styles.sub}>WhatsApp · Order #TH-88213</div>
                </div>
                <div className={styles.status}>Resolved by agent</div>
            </div>

            <div className={styles.messages}>
                {messages.map((m) => (
                    <div key={m.id} className={`${styles.msg} ${styles[m.from]}`}>
                        {m.from === 'agent' && <div className={styles.tag}>AI Agent</div>}
                        <div className={styles.bubble}>{m.text}</div>
                        <div className={styles.meta}>{m.time}</div>
                    </div>
                ))}
            </div>

            <div className={styles.composer}>
                <input type='text' placeholder='Reply as the merchant, or let the agent handle it…' disabled/>
                <button disabled>Send</button>
            </div>
        </div>
    )
}
