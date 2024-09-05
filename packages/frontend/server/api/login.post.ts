export default defineEventHandler(async (event) => {
    const formData = await readFormData(event)

    const data = await $fetch<SessionData>('/login', {
        method: 'POST',
        body: Object.fromEntries(formData),
        baseURL: process.env.API_URL,
    })

    await setSession(event, data)

    return {
        isLogged: true,
    }
})