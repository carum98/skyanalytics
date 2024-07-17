import { InsertSessionsSchema, sessions } from '@schemas/sessions.schemas'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SessionRepository {
    constructor(private readonly db: NodePgDatabase) {}

    public async create(params: InsertSessionsSchema) {
        const data = await this.db.insert(sessions)
            .values(params)
            .returning()

        return data.at(0)
    }
}