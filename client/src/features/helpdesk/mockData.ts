import type { Conversation } from '../../shared/types/conversation';
import type { Message } from '../../shared/types/message';

export const mockConversations: Conversation[] = [
    { id: 1, name: 'Ploy S.', channel: 'whatsapp', preview: "Where's my order? It's been 5 days...", time: '2m', active: true },
    { id: 2, name: 'Napat K.', channel: 'shopee', preview: 'Can I get a refund for this?', time: '14m', active: false },
    { id: 3, name: 'Aom_shops', channel: 'ig', preview: 'Do you have this in size M?', time: '1h', active: false },
];

export const mockMessages: Message[] = [
    { id: 1, from: 'customer', text: "Hi, where's my order? It's been 5 days and I haven't received anything 😕", time: '10:14' },
    { id: 2, from: 'agent', text: 'Checking that for you now — one moment.', time: '10:14' },
    { id: 3, from: 'agent', text: "Your order #TH-88213 shipped on Sep 18 and is currently out for delivery — it's expected today by 6pm. Here's the tracking: TH88213SF. Let me know if it doesn't arrive!", time: '10:14' },
    { id: 4, from: 'customer', text: 'Oh perfect, thank you!', time: '10:16' },
];
