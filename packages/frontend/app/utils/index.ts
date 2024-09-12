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