export default defineEventHandler(async (event) => {
    const method = event.method

    const slug = getRouterParam(event, 'slug') as string
    const query = getQuery(event)
    const headers = getRequestHeaders(event)

    if (method === 'GET') {
        const data = await useApiFetch(event, slug, {
            method,
            query,
            headers
        })

        return data
    } else if (method === 'POST' || method === 'PUT') {
        const body = await readBody(event)

        const data = await useApiFetch(event, slug, {
            method,
            body,
            headers
        })

        return data
    }  else if (method === 'DELETE') {
        const data = await useApiFetch(event, slug, {
            method,
            headers
        })

        return data
    }
})
