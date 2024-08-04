export type FetchRequestOptions = RequestInit & { query?: Record<string, string | undefined> }

export async function $fetch<T>(url: string, options?: FetchRequestOptions) {
    const uri = new URL(url, 'http://localhost:3001')

    // Add query parameters to the URL
    if (options?.query) {
        Object.entries(options.query).forEach(([key, value]) => {
            if (value !== undefined) {
                uri.searchParams.append(key, value as any)
            }
        })
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