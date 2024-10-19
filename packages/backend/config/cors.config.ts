import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin) return callback(null, true); // Allow requests with no origin
		callback(null, origin);  // Permit all origins
	},
	credentials: true,
}