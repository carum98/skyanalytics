import { RepositoryCore } from '@core/repository.core'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { events, InsertEventsSchema, paginatedEventsSchema, selectEventsSchema, SelectEventsSchema } from '@schemas/events.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { sources } from '@schemas/sources.schemas'

export class EventsRepository extends RepositoryCore<SelectEventsSchema, InsertEventsSchema, InsertEventsSchema>{
    constructor (public readonly db: NodePgDatabase) {
        const table = events

        const select = db.select({
            id: events.id,
            name: events.name,
            source: {
                id: sources.id,
                name: sources.name
            }
        })
        .from(table)
        .leftJoin(sources, eq(events.source_id, sources.id))

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginatedEventsSchema.parse(data)
    }

    public async get(id: number) {
        const data = await this.getOneCore({
            where: eq(events.id, id)
        })

        return selectEventsSchema.parse(data)
    }

    public async create(params: any) {
        const data = await this.insertCore({
            params
        })

        return selectEventsSchema.parse(data)
    }

    public async update(id: number, params: any) {
        const data = await this.updateCore({
            where: eq(events.id, id),
            params
        })

        return selectEventsSchema.parse(data)
    }

    public async delete(id: number) {
        return this.deleteCore(eq(events.id, id))
    }
}
