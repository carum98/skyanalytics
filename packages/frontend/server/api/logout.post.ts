export default defineEventHandler(async (event) => {
    await clearSkSession(event)
    return {
        isLogged: false,
    }
})