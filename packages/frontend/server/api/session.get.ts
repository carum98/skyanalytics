export default defineEventHandler(async (event) => {
	const { user: { code, ...rest } } = await getSkSession(event)

	return rest
})