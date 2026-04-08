import { describe, it, expect, vi } from 'vitest';
import TrackingController from '../TrackingController';
import { messages } from '../../../shared/messages';

// Mock glogal fetch
global.fetch = vi.fn();
process.env.TRACKING_API_TOKEN = 'test_token';

describe('TrackingController', () => {
    it('should return INVALID_CODE on 404 response', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false,
            status: 404,
            text: async () => "Not Found"
        });
        
        const response = await TrackingController.index('INVALIDCODEBR');
        expect(response).toBe(messages.INVALID_CODE);
    });

    it('should return tracking information on valid response', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                json: JSON.stringify({
                    eventos: [
                        {
                            dtHrCriado: { date: "2026-01-01 10:00:00" },
                            descricao: "Objeto Entregue",
                            unidade: {
                                endereco: {
                                    cidade: "SÃO PAULO",
                                    uf: "SP"
                                }
                            }
                        }
                    ]
                })
            })
        });
        
        const response = await TrackingController.index('AA123456789BR');
        expect(response).toContain('Objeto Entregue');
        expect(response).toContain('SÃO PAULO / SP');
        expect(response).toContain('2026');
    });

    it('should return no updates message when events list is empty', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                objetos: [{
                    eventos: []
                }]
            })
        });
        
        const response = await TrackingController.index('AA123456789BR');
        expect(response).toContain('Ainda não há atualizações');
    });
});
