import pg from 'pg'
import databaseConfig from 'config/database.config'

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

export async function init (): Promise<void> {
    const client = new pg.Client(databaseConfig)

    await client.connect()

    const db = drizzle(client)

    console.log('Migrating database...')
    await migrate(db, { migrationsFolder: 'database' })
    console.log('Migrations completed!')

    await client.end()

    process.exit(0)
}