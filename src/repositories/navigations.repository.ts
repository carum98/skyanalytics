import { RepositoryCore } from '@core/repository.core'
import { MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertNavigationsSchema, navigations, paginatedNavigationsSchema, selectNavigationsSchema, SelectNavigationsSchema } from '@schemas/navigations.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { and, between, count, countDistinct, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class NavigationRepository extends RepositoryCore<SelectNavigationsSchema, InsertNavigationsSchema, InsertNavigationsSchema>{
    constructor(public readonly db: NodePgDatabase) {
        const table = navigations

        const select = db.select({
            id: navigations.id,
            name: navigations.name,
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginatedNavigationsSchema.parse(data)
    }

    public async get(id: number) {
        const data = await this.getOneCore({
            where: eq(navigations.id, id)
        })

        return selectNavigationsSchema.parse(data)
    }

    public async create(params: InsertNavigationsSchema) {
        const data = await this.insertCore({
            params
        })

        return selectNavigationsSchema.parse(data)
    }

    public async update(id: number, params: any) {
        const data = await this.updateCore({
            where: eq(navigations.id, id),
            params
        })

        return selectNavigationsSchema.parse(data)
    }

    public async delete(id: number) {
        return this.deleteCore(eq(navigations.id, id))
    }

    public async getMetrics(code: string, filters: MetricsFilter) {
        const data = await this.db.select({
            views: count(),
            visitors: countDistinct(sessions.uuid),
        })
        .from(navigations)
        .leftJoin(sessions, eq(navigations.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(and(
            eq(sources.code, code),
            between(navigations.created_at, new Date(filters.start), new Date(filters.end))
        ))

        return data.at(0)
    }

    public async getStats(code: string, filters: StatsFilter) {
        const data = await this.db.select({
            name: navigations.name,
            count: count(navigations.name)
        })
        .from(navigations)
        .leftJoin(sessions, eq(navigations.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(
            and(
                eq(sources.code, code),
                between(navigations.created_at, new Date(filters.start), new Date(filters.end))
            )
        )
        .groupBy(navigations.name)

        return {
            navigations: Object.fromEntries(data.map(item => [item.name, item.count]))
        }
    }
}