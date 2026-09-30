import styles from './ChatThread.module.css'
import {mockMessages} from '../mockData'

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
                {mockMessages.map((m) => (
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
