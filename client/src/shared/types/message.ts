export type MessageSender = 'customer' | 'agent';

export interface Message {
    id: number;
    from: MessageSender;
    text: string;
    time: string;
}
