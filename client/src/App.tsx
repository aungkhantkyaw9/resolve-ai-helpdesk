import { ConversationList } from './features/helpdesk/components/ConversationList';
import { ChatThread } from './features/helpdesk/components/ChatThread';
import { TracePanel } from './features/helpdesk/components/TracePanel';
import { useSendMessage } from './features/helpdesk/hooks/useSendMessage';
import { mockMessages } from './features/helpdesk/mockData';
import styles from './App.module.css';

function App() {
    const { messages, traceSteps, sending, error, send } = useSendMessage(mockMessages);

    return (
        <div className={styles.workspace}>
            <ConversationList />
            <ChatThread messages={messages} sending={sending} error={error} onSend={send} />
            <TracePanel steps={traceSteps} />
        </div>
    );
}

export default App;
