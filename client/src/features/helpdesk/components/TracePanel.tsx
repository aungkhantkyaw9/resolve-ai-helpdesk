import styles from './TracePanel.module.css';
import { mockTraceSteps } from '../mockData';

export function TracePanel() {
    return (
        <div className={styles.pane}>
            <div className={styles.head}>
                <div className={styles.title}>Agent trace</div>
                <div className={styles.sub}>What the agent did to resolve this</div>
            </div>

            <div className={styles.steps}>
                {mockTraceSteps.map((s) => (
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
    );
}
