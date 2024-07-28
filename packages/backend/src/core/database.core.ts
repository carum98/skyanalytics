import databaseConfig from 'config/database.config'

import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

export class Database {
    private readonly _db: NodePgDatabase

    constructor () {
        const poolConnection = new pg.Pool(databaseConfig)

        this._db = drizzle(poolConnection)
    }

    public get db (): NodePgDatabase {
        return this._db
    }
}