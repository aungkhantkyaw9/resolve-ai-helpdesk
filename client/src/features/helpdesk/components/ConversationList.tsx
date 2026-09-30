import styles from './ConversationList.module.css'
import {mockConversations} from '../mockData'

export function ConversationList() {
    return (
        <div className={styles.pane}>
            <div className={styles.head}>Inbox · {mockConversations.length} open</div>
            {mockConversations.map((c) => (
                <div key={c.id} className={`${styles.item} ${c.active ? styles.active : ''}`}>
                    <span className={`${styles.dot} ${styles[`ch-${c.channel}`]}`}/>
                    <div className={styles.body}>
                        <div className={styles.row}>
                            <span className={styles.name}>{c.name}</span>
                            <span className={styles.time}>{c.time}</span>
                        </div>
                        <div className={styles.preview}>{c.preview}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}
