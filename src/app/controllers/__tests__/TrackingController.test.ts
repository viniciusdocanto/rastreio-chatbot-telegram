import { describe, it, expect, vi } from 'vitest';
import TrackingController from '../TrackingController';
import { messages } from '../../../shared/messages';

// Mock glogal fetch
global.fetch = vi.fn();

describe('TrackingController', () => {
    it('should return INVALID_CODE on 404 response', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 404
        });
        
        const response = await TrackingController.index('INVALIDCODEBR');
        expect(response).toBe(messages.INVALID_CODE);
    });

    it('should return tracking information on valid response', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                codigo: "AA123456789BR",
                eventos: [
                    {
                        data: "01/01/2026",
                        hora: "10:00:00",
                        status: "Objeto Entregue",
                        subStatus: [],
                        local: "SÃO PAULO - SP"
                    }
                ]
            })
        });
        
        const response = await TrackingController.index('AA123456789BR');
        expect(response).toContain('Objeto Entregue');
        expect(response).toContain('SÃO PAULO - SP');
        expect(response).toContain('01/01/2026 10:00:00');
    });

    it('should return no updates message when events list is empty', async () => {
         (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                codigo: "AA123456789BR",
                eventos: []
            })
        });
        
        const response = await TrackingController.index('AA123456789BR');
        expect(response).toContain('Ainda não há atualizações');
    });
});
