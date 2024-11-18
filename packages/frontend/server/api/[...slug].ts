export default defineEventHandler(async (event) => {
    const method = event.method

    const slug = getRouterParam(event, 'slug') as string
    const query = getQuery(event)
    const headers = getRequestHeaders(event)

    if (method === 'GET') {
        return useApiFetch(event, slug, {
            method,
            query,
            headers
        })
    } else if (method === 'POST' || method === 'PUT') {
        const body = await readBody(event)

        return useApiFetch(event, slug, {
            method,
            body,
            headers,
            query
        })
    }  else if (method === 'DELETE') {
        return useApiFetch(event, slug, {
            method,
            headers
        })
    }
})
