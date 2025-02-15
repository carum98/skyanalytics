export type FetchRequestOptions = RequestInit & { query?: Record<string, string | undefined> }

export async function $fetch<T>(url: string, options?: FetchRequestOptions) {
    const uri = new URL(url, import.meta.env.VITE_URL_FRONTEND)

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

    if (response.status === 204) {
        return null as unknown as T
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
        return await response.json() as T
    } 

    if (response.headers.get('Content-Type')?.includes('application/octet-stream')) {
        return await response.blob() as unknown as T
    }

    if (response.headers.get('Content-Type')?.includes('image')) {
        return await response.blob() as unknown as T
    }

    return await response.text() as unknown as T
}