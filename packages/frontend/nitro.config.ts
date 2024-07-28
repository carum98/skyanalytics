export default defineNitroConfig({
    srcDir: "server",
    routeRules: {
        '/api/**': { 
            cors: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400',
            }
        },
    }
})