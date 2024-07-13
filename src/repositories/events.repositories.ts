import { BadRequestError } from '@utils/errors'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { events, SelectEventsSchema } from 'src/schemas/events.schemas'

export class EventsRepository {
    constructor (private db: NodePgDatabase) {}

    public async getAll(): Promise<any> {
        const data = await this.db.select().from(events)

        return data
    }

    public async create(params: any): Promise<any> {
        return await this.db.insert(events).values(params).returning()
    }

    public async get(id: number): Promise<SelectEventsSchema> {
        const data = await this.db.select().from(events).where(eq(events.id, id))

        if (!data[0]) {
            throw new BadRequestError('Event not found')
        }

        return data[0]
    }

    public async update(id: number, params: any): Promise<SelectEventsSchema> {
        const data = await this.db.update(events).set(params).where(eq(events.id, id)).returning()

        return data[0]
    }

    public async delete(id: number): Promise<void> {
        await this.db.delete(events).where(eq(events.id, id))
    }
}
