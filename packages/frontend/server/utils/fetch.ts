import { ofetch, type FetchOptions } from 'ofetch'
import { H3Event, createError } from 'h3'
import { getSkSession, clearSkSession } from '~/utils/session'

const apiFetch = ofetch.create({ 
    baseURL: process.env.URL_BACKEND, 
    headers: {
        'Content-Type': 'application/json'
    }
})

export async function useApiFetch (event: H3Event, request: RequestInfo, options?: FetchOptions) {
    const session = await getSkSession(event)
    const token = session.token

    if (token === null) {
        return await useLogout(event)
    }

    return apiFetch(request, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            ...options?.headers
        },
        async onResponseError({ response, error }) {
            if (response.status === 401) {
                await useLogout(event)
            } else {
                sendError(event, createError({
                    statusCode: response.status,
                    data: response._data,
                    stack: error?.stack
                }))
            }
        }
    })
}

export const useLogout = async (event: H3Event) => {
    await clearSkSession(event)
    return await sendRedirect(event, '/login', 302)
}
