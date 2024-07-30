export async function $fetch(url: string, options?: RequestInit) {
    const uri = new URL(url, 'http://localhost:3001')

    const response = await fetch(uri, {
        ...options,
        credentials: 'include',
    })
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json()
}