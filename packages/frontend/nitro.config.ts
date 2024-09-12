export default defineNitroConfig({
    preset: 'node-server',
    srcDir: "server",
    routeRules: {
        '/api/**': { 
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': import.meta.env.VITE_URL_FRONTEND || 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Timezone, Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Credentials': 'true'
            }
        },
    }
})