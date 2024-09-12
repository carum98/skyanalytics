export default defineEventHandler(async (event) => {
    const formData = await readFormData(event)

    const data = await $fetch<SessionData>('/login', {
        method: 'POST',
        body: Object.fromEntries(formData),
        baseURL: process.env.URL_BACKEND,
    })

    await setSession(event, data)

	await setSession(event, {
		...data,
		user: await useApiFetch(event, '/me')
	})

    return {
        isLogged: true,
    }
})