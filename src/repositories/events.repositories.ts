import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { events } from 'src/schemas/events.schemas'

export class EventsRepository {
    constructor (private db: NodePgDatabase) {}

    public async getAll(): Promise<any> {
        const data = await this.db.select().from(events)

        console.log(data)

        return data
    }

    public async create(params: any): Promise<any> {
        return await this.db.insert(events).values(params).returning()
    }
}
