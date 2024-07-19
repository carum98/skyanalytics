import { RepositoryCore } from '@core/repository.core'
import { PaginationSchemaType } from '@utils/pagination'
import { and, between, count, countDistinct, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { sources, SelectSourcesSchema, InsertSourcesSchema, paginateSourcesSchema, selectSourcesSchema } from '@schemas/sources.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { navigations } from '@schemas/navigations.schemas'
import { MetricsFilter } from '@schemas/_query'

export class SourcesRepository extends RepositoryCore<SelectSourcesSchema, InsertSourcesSchema, InsertSourcesSchema> {
    constructor (public readonly db: NodePgDatabase) {
        const table = sources

        const select = db.select({
            id: sources.id,
            name: sources.name
        }).from(table)

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginateSourcesSchema.parse(data)
    }

    public async get(id: number) {
        const data = await this.getOneCore({
            where: eq(sources.id, id)
        })

        return selectSourcesSchema.parse(data)
    }

    public async create(params: InsertSourcesSchema) {
        const data = await this.insertCore({
            params
        })

        return selectSourcesSchema.parse(data)
    }

    public async update(id: number, params: InsertSourcesSchema) {
        const data = await this.updateCore({
            where: eq(sources.id, id),
            params
        })

        return selectSourcesSchema.parse(data)
    }

    public async delete(id: number) {
        return this.deleteCore(eq(sources.id, id))
    }

    public async getMetrics(id: number, filters: MetricsFilter) {
        const data = await this.db.select({
            views: count(),
            visitors: countDistinct(sessions.uuid),
        })
        .from(navigations)
        .leftJoin(sessions, eq(navigations.session_id, sessions.id))
        .where(and(
            eq(sessions.source_id, id),
            between(navigations.created_at, new Date(filters.start), new Date(filters.end))
        ))

        return data.at(0)
    }
}