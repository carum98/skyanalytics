import { PoolOptions } from 'mysql2/promise'

export default {
    host: 'db', // network name of the database container
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306, 
} as PoolOptions