export function getCookie(name: string) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export function cookieExists(name: string) {
    return document.cookie.includes(name)
}