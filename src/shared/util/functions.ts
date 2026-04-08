export function runRegex(pattern: RegExp, phase: string) {
    return pattern.exec(phase);
}

export function normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
