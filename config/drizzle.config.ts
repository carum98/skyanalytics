import { defineConfig } from 'drizzle-kit'
import databaseConfig from './database.config'

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/schemas/*.schemas.ts',
    out: './database',
    dbCredentials: databaseConfig as any
})