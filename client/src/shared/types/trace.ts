export interface TraceStep {
    id: number;
    icon: string;
    label: string;
    content: string;
    done: boolean;
    result?: boolean;
}
