export default defineEventHandler(async (event) => {
    await clearSession(event)
    return {
        isLogged: false,
    }
})