export const toolDefinitions = [
    {
        type: 'function',
        name: 'lookup_order',
        description: "Look up a customer's order status, shipping date, ETA, and tracking number by order ID.",
        parameters: {
            type: 'object',
            properties: {
                orderId: { type: 'string', description: 'The order ID, e.g. "TH-88213"' },
            },
            required: ['orderId'],
        },
    },
    {
        type: 'function',
        name: 'check_inventory',
        description: 'Check current stock level for a product by its SKU.',
        parameters: {
            type: 'object',
            properties: {
                sku: { type: 'string', description: 'The product SKU, e.g. "WE-BLK-M"' },
            },
            required: ['sku'],
        },
    },
    {
        type: 'function',
        name: 'issue_refund',
        description: 'Issue a refund for an order. Only call this after confirming the order qualifies (e.g. within policy timeframe).',
        parameters: {
            type: 'object',
            properties: {
                orderId: { type: 'string' },
                reason: { type: 'string', description: 'Brief reason for the refund' },
            },
            required: ['orderId', 'reason'],
        },
    },
] as const;
