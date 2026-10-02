import type { ReactNode } from 'react';

export function formatText(text: string): ReactNode {
    const lines = text.split('\n');
    return lines.map((line, i) => (
        <span key={i}>
      {renderBold(line)}
            {i < lines.length - 1 && <br />}
    </span>
    ));
}

function renderBold(line: string): ReactNode[] {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
    });
}
