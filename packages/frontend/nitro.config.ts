export default defineNitroConfig({
    preset: 'node-server',
    srcDir: "server",
    routeRules: {
        '/api/**': { 
            cors: true,
            headers: {
                'Access-Control-Allow-Origin': 'https://skyanalytics.carum.dev',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Timezone, Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
                'Access-Control-Allow-Credentials': 'true'
            }
        },
    }
})