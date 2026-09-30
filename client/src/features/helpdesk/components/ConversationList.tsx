import styles from './ConversationList.module.css'

const conversations = [
    {
        id: 1,
        name: 'Ploy S.',
        channel: 'whatsapp',
        preview: 'Where\'s my order? It\'s been 5 days...',
        time: '2m',
        active: true
    },
    {id: 2, name: 'Napat K.', channel: 'shopee', preview: 'Can I get a refund for this?', time: '14m', active: false},
    {id: 3, name: 'Aom_shops', channel: 'ig', preview: 'Do you have this in size M?', time: '1h', active: false}
]

export function ConversationList() {
    return (
        <div className={styles.pane}>
            <div className={styles.head}>Inbox · {conversations.length} open</div>
            {conversations.map((c) => (
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
