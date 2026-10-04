import type {ReactNode} from 'react'

export function formatText(text: string): ReactNode {
    const lines = text.split('\n');
    return lines.map((line, i) => (
        <span key={i}>
      {renderLine(line)}
            {i < lines.length - 1 && <br />}
    </span>
    ));
}

function renderLine(line: string): ReactNode[] {
    const headerMatch = line.match(/^#{1,3}\s+(.*)/);
    const cleanLine = headerMatch ? headerMatch[1] : line;
    const isHeader = Boolean(headerMatch);

    const parts = cleanLine.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    const rendered = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className={codeStyle}>{part.slice(1, -1)}</code>;
        }
        return <span key={i}>{part}</span>;
    });

    return isHeader ? [<strong key="h">{rendered}</strong>] : rendered;
}

const codeStyle = 'inline-code';
