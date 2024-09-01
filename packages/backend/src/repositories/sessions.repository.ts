import { RepositoryCore } from '@core/repository.core'
import { FilterSessions, StatsFilter } from '@schemas/_query'
import { navigations } from '@schemas/navigations.schemas'
import { InsertSessionsSchema, paginateSessionsSchema, SelectSessionsSchema, sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { and, between, eq, isNotNull, sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SessionRepository extends RepositoryCore<SelectSessionsSchema, InsertSessionsSchema, InsertSessionsSchema> {
    constructor(public readonly db: NodePgDatabase) {
        const table = sessions

        const select = db.selectDistinct({
            country: sessions.country,
            os: sessions.os,
            software: sessions.software,
            location: sql`${sessions.location}::jsonb`,
        })
        .from(table)
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .leftJoin(navigations, eq(sessions.id, navigations.session_id))

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType & FilterSessions) {
        const data = await this.getAllCore({
            query: query,
            where: query.start && query.end
                ? between(navigations.created_at, new Date(query.start), new Date(query.end))
                : undefined,
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

    public async getLocations(filters: FilterSessions) {
        const data = await this.db.selectDistinct({
            sources_code: sources.code,
            sources_name: sources.name,
            location: sql`${sessions.location}::jsonb`,
        })
        .from(sessions)
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .leftJoin(navigations, eq(sessions.id, navigations.session_id))
        .where(
            and(
                isNotNull(sessions.location),
                between(navigations.created_at, new Date(filters.start), new Date(filters.end))
            )
        )

        return Object.entries(Object.groupBy(
            data, 
            (item) => item.sources_code as string
        ))
        .map(([key, value]) => ({
            code: key,
            name: value?.at(0)?.sources_name,
            locations: value?.map(item => item.location) || []
        }))
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