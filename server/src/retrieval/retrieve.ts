import policies from '../data/policies.json' with { type: 'json' };

export interface RetrievedPolicy {
    id: string;
    title: string;
    content: string;
}

export function retrievePolicy(message: string): RetrievedPolicy | null {
    const lower = message.toLowerCase();

    let best: { policy: (typeof policies)[number]; score: number } | null = null;

    for (const policy of policies) {
        const score = policy.keywords.filter((kw) => lower.includes(kw)).length;
        if (score > 0 && (!best || score > best.score)) {
            best = { policy, score };
        }
    }

    if (!best) return null;
    return { id: best.policy.id, title: best.policy.title, content: best.policy.content };
}
