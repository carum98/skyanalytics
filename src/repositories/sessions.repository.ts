import { InsertSessionsSchema, sessions } from '@schemas/sessions.schemas'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SessionRepository {
    constructor(private readonly db: NodePgDatabase) {}

    public async create(params: InsertSessionsSchema) {
        const data = await this.db.insert(sessions)
            .values(params)
            .returning()

        return data.at(0)
    }

    public async find(uuid: string) {
        const data = await this.db.select()
            .from(sessions)
            .where(eq(sessions.uuid, uuid))

        return data.at(0)
    }
}