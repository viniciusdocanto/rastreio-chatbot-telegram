import { describe, it, expect } from 'vitest';
import { regex } from '../regex';

describe('Regex Tests', () => {
  it('should match valid tracking numbers', () => {
    expect(regex.TRACKING_CODE.test('AA123456789BR')).toBe(true);
    expect(regex.TRACKING_CODE.test('ab123456789br')).toBe(true);
    expect(regex.TRACKING_CODE.test('ZZ000000000XX')).toBe(true);
  });

  it('should not match invalid tracking numbers', () => {
    expect(regex.TRACKING_CODE.test('A123456789BR')).toBe(false); // only 1 initial char
    expect(regex.TRACKING_CODE.test('AA12345678BR')).toBe(false); // only 8 digits
    expect(regex.TRACKING_CODE.test('AA123456789B')).toBe(false); // only 1 final char
    expect(regex.TRACKING_CODE.test('AA123456789BRA')).toBe(false); // 3 final chars
    expect(regex.TRACKING_CODE.test('AA123A56789BR')).toBe(false); // letter in digits
  });

  it('should match /start command', () => {
    expect(regex.COMMANDS.START.test('/start')).toBe(true);
    expect(regex.COMMANDS.START.test('comando /start')).toBe(true);
    expect(regex.COMMANDS.START.test('/stop')).toBe(false);
  });
});
