import { describe, expect, it } from 'vitest';
import { retrievePolicy } from './retrieve.js';

describe('retrievePolicy', () => {
    it('uses the refund policy for refund questions', () => {
        expect(retrievePolicy('Can I get a refund for order TH-90021?')?.id).toBe('refund-policy');
    });

    it('uses the shipping policy for "where is my order"', () => {
        expect(retrievePolicy("Where's my order TH-88213?")?.id).toBe('shipping-and-delivery');
    });

    it('handles curly apostrophes from phone keyboards', () => {
        expect(retrievePolicy('Where’s my order TH-88213?')?.id).toBe('shipping-and-delivery');
    });

    it('uses the shipping policy for tracking questions', () => {
        expect(retrievePolicy('What is the tracking number for TH-91500?')?.id).toBe('shipping-and-delivery');
    });

    it('uses the size policy for exchange questions', () => {
        expect(retrievePolicy('Do you have this in size M?')?.id).toBe('size-exchange');
    });

    it('returns null when nothing matches', () => {
        expect(retrievePolicy('hello there')).toBeNull();
    });
});
