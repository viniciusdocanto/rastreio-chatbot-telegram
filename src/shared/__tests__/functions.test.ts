import { describe, it, expect } from 'vitest';
import { runRegex, normalizeText } from '../util/functions';
import { regex } from '../regex';

describe('Function Tests', () => {
    it('runRegex should correctly execute regex patterns', () => {
        expect(runRegex(regex.TRACKING_CODE, 'AA123456789BR')).toBeTruthy();
        expect(runRegex(regex.TRACKING_CODE, 'INVALID')).toBeNull();
    });

    it('normalizeText should remove accents and lower case', () => {
        expect(normalizeText('OLÁ')).toBe('ola');
        expect(normalizeText('olá')).toBe('ola');
        expect(normalizeText('Açúcar')).toBe('acucar');
        expect(normalizeText('até mais')).toBe('ate mais');
        expect(normalizeText('TCHAU')).toBe('tchau');
    });
});
