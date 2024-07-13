import { RepositoryCore } from '@core/repository.core'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { events, InsertEventsSchema, SelectEventsSchema } from '@schemas/events.schemas'

export class EventsRepository extends RepositoryCore<SelectEventsSchema, InsertEventsSchema, InsertEventsSchema>{
    constructor (public readonly db: NodePgDatabase) {
        const table = events

        const select = db.select().from(table)

        super({ db, table, select })
    }

    public async getAll() {
        return this.getAllCore({
            query: {
                page: 1,
                per_page: 10,
                sort_by: 'id',
                sort_order: 'asc'
            },
            where: undefined
        })
    }

    public async get(id: number) {
        return this.getOneCore({
            where: eq(events.id, id)
        })
    }

    public async create(params: any) {
        return this.insertCore({
            params
        })
    }

    public async update(id: number, params: any) {
        return this.updateCore({
            where: eq(events.id, id),
            params
        })
    }

    public async delete(id: number) {
        await this.deleteCore(eq(events.id, id))
    }
}
