import { MySql2Database } from 'drizzle-orm/mysql2'
import { events } from 'src/schemas/events.schemas'

export class EventsRepository {
    constructor (private db: MySql2Database) {}

    public async getAll(): Promise<any> {
        const data = await this.db.select().from(events)

        console.log(data)

        return data
    }

    public async create(params: any): Promise<void> {
        const data = await this.db.insert(events).values(params)

        console.log(data)
    }
}
