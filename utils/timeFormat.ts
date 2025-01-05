export function parseSeconds(milliseconds: number): number[] {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const tenths = Math.floor((milliseconds / 100) % 10);
    
    return [totalSeconds, tenths];
}

export function formatTime(milliseconds: number): string {
    const [totalSeconds, tenths] = parseSeconds(milliseconds);
    return `${Math.max(totalSeconds, 0)}.${Math.max(tenths, 0)}`;
}
