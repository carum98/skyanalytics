import { RepositoryCore } from '@core/repository.core'
import { and, between, count, countDistinct, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { events, InsertEventsSchema, paginatedEventsSchema, selectEventsSchema, SelectEventsSchema } from '@schemas/events.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { FilterSessions, StatsFilter } from '@schemas/_query'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'

export class EventsRepository extends RepositoryCore<SelectEventsSchema, InsertEventsSchema, InsertEventsSchema>{
    constructor (public readonly db: NodePgDatabase) {
        const table = events

        const select = db.select({
            id: events.id,
            name: events.name,
			created_at: events.created_at,
			session: {
                os: sessions.os,
                software: sessions.software,
                country: sessions.country,
            },
        })
        .from(table)
		.innerJoin(sessions, eq(events.session_id, sessions.id))
		.innerJoin(sources, eq(sessions.source_id, sources.id))

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType & FilterSessions) {
        const data = await this.getAllCore({
            query: query,
            where: query.start && query.end
                ? between(events.created_at, new Date(query.start), new Date(query.end))
                : undefined
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

    public async getStat(code: string, filters: StatsFilter) {
        const data = await this.db.select({
            name: events.name,
            count: count(events.name)
        })
        .from(events)
        .leftJoin(sessions, eq(events.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(
            and(
                eq(sources.code, code),
                between(events.created_at, new Date(filters.start), new Date(filters.end))
            )
        )
        .groupBy(events.name)

        return {
            events: Object.fromEntries(data.map(item => [item.name, item.count]))
        }
    }
}
