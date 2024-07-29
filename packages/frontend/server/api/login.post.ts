import { setSession } from '../core/session'
import type { SessionData } from '../core/types'

export default defineEventHandler(async (event) => {
    const formData = await readFormData(event)

    const config = useRuntimeConfig()

    const data = await $fetch<SessionData>('/login', {
        method: 'POST',
        body: Object.fromEntries(formData),
        baseURL: 'http://localhost:3000',
    })

    await setSession(event, data)

    return {
        isLogged: true,
    }
})