import {ConversationList} from './features/helpdesk/components/ConversationList'
import {ChatThread} from './features/helpdesk/components/ChatThread'
import {TracePanel} from './features/helpdesk/components/TracePanel'
import styles from './App.module.css'

function App() {
    return (
        <div className={styles.workspace}>
            <ConversationList/>
            <ChatThread/>
            <TracePanel/>
        </div>
    )
}

export default App
