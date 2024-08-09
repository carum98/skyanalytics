export function parseToUTC(date: string | Date, timeZone: string): string {
    const utcOffset = timeZone.includes('UTC') 
        ? timeZone
        : getUTCOffsetForTimeZone(timeZone)

    const offset = parseInt(utcOffset.replace('UTC', ''))

    const localDate = new Date(new Date(date).getTime() - (offset * 60 * 60 * 1000))

    return localDate.toISOString()
}

export function parseToTimeZone(date: string | Date, timeZone: string): string {
    const utcOffset = timeZone.includes('UTC') 
        ? timeZone
        : getUTCOffsetForTimeZone(timeZone)

    const offset = parseInt(utcOffset.replace('UTC', ''))

    const localDate = new Date(new Date(date).getTime() + (offset * 60 * 60 * 1000))

    return localDate.toISOString()
}

/**
 * @example
 * getUTCOffsetForTimeZone('America/Costa_Rica') // UTC-6
 * getUTCOffsetForTimeZone('America/New_York') // UTC-5 
 */
export function getUTCOffsetForTimeZone(timeZone: string) {
    const now = new Date()

    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone }))

    const offset = (utcDate.getTime() - tzDate.getTime()) / 60000
    const sign = offset > 0 ? '-' : '+'
    const hours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, '0')

    return `UTC${sign}${hours}`
}