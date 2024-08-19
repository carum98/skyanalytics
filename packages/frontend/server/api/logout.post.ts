import { clearSkSession } from '~/utils/session'

export default defineEventHandler(async (event) => {
    await clearSkSession(event)
    return {
        isLogged: false,
    }
})