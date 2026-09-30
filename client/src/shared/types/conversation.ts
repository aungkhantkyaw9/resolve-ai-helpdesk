export type Channel = 'whatsapp' | 'shopee' | 'ig';

export interface Conversation {
    id: number;
    name: string;
    channel: Channel;
    preview: string;
    time: string;
    active: boolean;
}
