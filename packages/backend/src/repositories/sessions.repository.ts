import { RepositoryCore } from '@core/repository.core'
import { StatsFilter } from '@schemas/_query'
import { navigations } from '@schemas/navigations.schemas'
import { InsertSessionsSchema, paginateSessionsSchema, SelectSessionsSchema, sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { and, between, eq, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SessionRepository extends RepositoryCore<SelectSessionsSchema, InsertSessionsSchema, InsertSessionsSchema> {
    constructor(public readonly db: NodePgDatabase) {
        const table = sessions

        const select = db.select({
            country: sessions.country,
            os: sessions.os,
            software: sessions.software,
        }).from(table)

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginateSessionsSchema.parse(data)
    }

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

    public async getStats(code: string, filters: StatsFilter) {
        const data = await this.db.selectDistinct({
            os: sessions.os,
            country: sessions.country,
            software: sessions.software,
            location: sql`${sessions.location}::jsonb`,
        })
        .from(sessions)
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .leftJoin(navigations, eq(sessions.id, navigations.session_id))
        .where(
            and(
                eq(sources.code, code),
                between(navigations.created_at, new Date(filters.start), new Date(filters.end))
            )
        )

        return {
            os: filters.stats.includes('os') 
                ? groupByAndCount(data, 'os') 
                : undefined,
            country: filters.stats.includes('country')
                ? groupByAndCount(data, 'country')
                : undefined,
            software: filters.stats.includes('software')
                ? groupByAndCount(data, 'software')
                : undefined,
            location: filters.stats.includes('location')
                ? data.filter(item => item.location).map(item => item.location)
                : undefined,
        }
    }
}

// This function groups the data by a key and counts the number of occurrences
// if the key is null, it will be replaced by 'Unknown'
function groupByAndCount(data: any[], key: string) {
    return Object.fromEntries(Object.entries(Object.groupBy(
        data, 
        (item) => item[key] as string
    ))
    .map(([key, value]) => [
        key === 'null' ? 'Unknown' : key, 
        value?.length || 0
    ]))
}