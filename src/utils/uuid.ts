import { createHash } from 'crypto'

function toUUIDv5(buffer: Buffer): string {
    buffer[6] = (buffer[6] & 0x0f) | 0x50; // version 5
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // variant RFC 4122
    const hex = buffer.toString('hex');
    return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
}

export function generateUUIDv5(names: string[], namespace: string): string {
    const concatenatedNames = names.join('|') // Concatena los nombres con un delimitador
    const nsBuffer = Buffer.from(namespace.replace(/-/g, ''), 'hex')
    const nameBuffer = Buffer.from(concatenatedNames, 'utf8')
    const hash = createHash('sha1').update(nsBuffer).update(nameBuffer).digest()
    return toUUIDv5(hash)
}
