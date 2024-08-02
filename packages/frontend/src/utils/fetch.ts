export async function $fetch<T>(url: string, options?: RequestInit & { query?: Record<string, string> }) {
    const uri = new URL(url, 'http://localhost:3001')

    // Add query parameters to the URL
    if (options?.query) {
        for (const [key, value] of Object.entries(options.query)) {
            uri.searchParams.append(key, value)
        }
    }

    const response = await fetch(uri, {
        ...options,
        credentials: 'include', // Send cookies
    })

    if (!response.ok) {
        throw new Error(response.statusText)
    }

    return await response.json() as T
}