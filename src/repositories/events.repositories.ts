import { RepositoryCore } from '@core/repository.core'
import { and, between, count, countDistinct, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { events, InsertEventsSchema, paginatedEventsSchema, selectEventsSchema, SelectEventsSchema } from '@schemas/events.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { StatsFilter } from '@schemas/_query'
import { sessions } from '@schemas/sessions.schemas'

export class EventsRepository extends RepositoryCore<SelectEventsSchema, InsertEventsSchema, InsertEventsSchema>{
    constructor (public readonly db: NodePgDatabase) {
        const table = events

        const select = db.select({
            id: events.id,
            name: events.name,
        })
        .from(table)

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

    public async create(params: InsertEventsSchema) {
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

    public async getStat(id: number, filters: StatsFilter) {
        const data = await this.db.select({
            name: events.name,
            count: count(events.name)
        })
        .from(events)
        .leftJoin(sessions, eq(events.session_id, sessions.id))
        .where(
            and(
                eq(sessions.source_id, id),
                between(events.created_at, new Date(filters.start), new Date(filters.end))
            )
        )
        .groupBy(events.name)

        return {
            events: Object.fromEntries(data.map(item => [item.name, item.count]))
        }
    }
}
