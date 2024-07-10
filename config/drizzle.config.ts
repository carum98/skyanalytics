import { defineConfig } from 'drizzle-kit'
import databaseConfig from './database.config'

export default defineConfig({
    dialect: 'mysql',
    schema: './src/schemas/*.schemas.ts',
    out: './database',
    dbCredentials: databaseConfig as any
})