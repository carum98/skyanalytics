import mysql from 'mysql2/promise'
import databaseConfig from 'config/database.config'
import { MySql2Database, drizzle } from 'drizzle-orm/mysql2'

export class Database {
    private readonly _db: MySql2Database

    constructor () {
        const poolConnection = mysql.createPool(databaseConfig)

        this._db = drizzle(poolConnection)
    }

    public get db (): MySql2Database {
        return this._db
    }
}