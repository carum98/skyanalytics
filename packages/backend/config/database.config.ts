import { PoolConfig } from 'pg'

export default {
    host: 'db', // network name of the database container
    port: 5432, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: false
} as PoolConfig