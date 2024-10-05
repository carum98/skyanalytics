export default defineEventHandler(async (event) => {
	// This is a catch-all with method OPTIONS to CORS preflight requests errors.
	// https://github.com/unjs/nitro/issues/2340#issuecomment-2308339076
	return null
})