export function getCurrentTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// return `Augost 12, 2021, 12:00 AM`
export function formatDate(dateString: string) {
    const date = new Date(dateString)

    const value = date.toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).toLowerCase()

    // Replace 'at' with ','
    return value.replace('at', ',')
}

// return `12 minutes ago`
export function timeAgo(dateString: string | Date) {
    const date = new Date(dateString)
    const now = toLocalDate(new Date())

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    let interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
        return interval + " years ago"
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
        return interval + " months ago"
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
        return interval + " days ago"
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
        return interval + " hours ago"
    }
    interval = Math.floor(seconds / 60)
    if (interval > 1) {
        return interval + " minutes ago"
    }
    return Math.floor(seconds) + " seconds ago"
}

export function getLast30Minutes() {
    const now = new Date()

    const format = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
    
        const time = date.toTimeString().split(' ').at(0)
    
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${time}`
    }

    return {
        start: format(new Date(now.getTime() - 30 * 60 * 1000)),
        end: format(now),
    }
}

function toLocalDate(date: Date): Date {
    const offset = date.getTimezoneOffset()
    const newDate = new Date(date.getTime() - (offset * 60 * 1000))

    return newDate
}

export function toUTCDate(date: Date): Date {
    const offset = date.getTimezoneOffset()
    const newDate = new Date(date.getTime() + (offset * 60 * 1000))

    return newDate
}