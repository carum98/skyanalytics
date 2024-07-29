export default defineNitroConfig({
    srcDir: "server",
    routeRules: {
        '/api/**': { 
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Credentials': 'true'
            }
        },
    }
})