import orders from '../data/orders.json' with { type: 'json' };
import inventory from '../data/inventory.json' with { type: 'json' };

type OrdersData = typeof orders;
type InventoryData = typeof inventory;

export function executeTool(name: string, args: Record<string, unknown>): unknown {
    switch (name) {
        case 'lookup_order': {
            const orderId = args.orderId as string;
            const order = (orders as OrdersData)[orderId as keyof OrdersData];
            if (!order) return { error: `No order found with ID ${orderId}` };
            return order;
        }

        case 'check_inventory': {
            const sku = args.sku as string;
            const item = (inventory as InventoryData)[sku as keyof InventoryData];
            if (!item) return { error: `No product found with SKU ${sku}` };
            return item;
        }

        case 'issue_refund': {
            // Mock only — always "approves" for demo purposes, no real payment system behind this
            return {
                approved: true,
                orderId: args.orderId,
                reason: args.reason,
                note: 'Mock refund — no real transaction occurred',
            };
        }

        default:
            return { error: `Unknown tool: ${name}` };
    }
}
