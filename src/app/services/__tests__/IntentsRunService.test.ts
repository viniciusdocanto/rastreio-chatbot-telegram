import { describe, it, expect, vi } from 'vitest';
import IntentsRunService from '../IntentsRunService';
import { messages } from '../../../shared/messages';

describe('IntentsRunService', () => {
    it('should return welcome message for /start command', async () => {
        const response = await IntentsRunService.execute('/start');
        // Because answers is an array and it randomly picks one, we can check if it returns one of the answers or an Intent object.
        // Wait, for single answers it just returns it as an Intent object in our new fix? Let's check logic:
        // it returns match.answers[random] if match.answers.length > 0.
        expect(response).toBe(messages.WELCOME);
    });

    it('should return welcome message for "oi" taking into account accents and commands', async () => {
        const response = await IntentsRunService.execute('olá');
         expect(response).toBe(messages.WELCOME);
    });

    it('should return bye message for "tchau"', async () => {
        const response = await IntentsRunService.execute('tchau');
        // Answers has multiple options
        const possibleAnswers = [messages.BYE, "Tchau, tchau!", "Bye!", "Espero te ver em breve!"];
        expect(possibleAnswers).toContain(response);
    });

    it('should execute tracking controller passing regex tracking code', async () => {
        // Mocking fetch specifically for this test
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({
                eventos: [{ status: "Recebido" }]
            })
        }) as any;
        
        const response = await IntentsRunService.execute('AA123456789BR');
        expect(response).not.toBe(messages.NOT_EXPECTED);
    });

    it('should return NOT_EXPECTED for unknown phrases', async () => {
        const response = await IntentsRunService.execute('random bad phrase');
        expect(response).toBe(messages.NOT_EXPECTED);
    });
});
