import styles from './TracePanel.module.css'

const steps = [
    {id: 1, icon: '📋', label: '1 · Retrieved policy', content: 'doc: shipping-and-delivery.md', done: true},
    {id: 2, icon: '🔍', label: '2 · Tool call', content: 'lookup_order(id="TH-88213")', done: true},
    {
        id: 3,
        icon: '📦',
        label: '3 · Result',
        content: 'status: out_for_delivery\neta: 2026-09-22T18:00',
        done: true,
        result: true
    },
    {id: 4, icon: '✅', label: '4 · Replied to customer', content: 'Sent tracking + ETA', done: true},
    {id: 5, icon: '⏸', label: '5 · Awaiting', content: 'No further action needed', done: false}
]

export function TracePanel() {
    return (
        <div className={styles.pane}>
            <div className={styles.head}>
                <div className={styles.title}>Agent trace</div>
                <div className={styles.sub}>What the agent did to resolve this</div>
            </div>

            <div className={styles.steps}>
                {steps.map((s) => (
                    <div key={s.id} className={`${styles.step} ${s.done ? styles.done : ''}`}>
                        <div className={styles.label}>{s.icon} {s.label}</div>
                        <div className={`${styles.content} ${s.result ? styles.result : ''}`}>
                            {s.content.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.footnote}>
                This panel is the part that matters — it shows the agent's reasoning, not just its reply.
            </div>
        </div>
    )
}
