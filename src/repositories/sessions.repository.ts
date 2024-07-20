import { StatsFilter } from '@schemas/_query'
import { InsertSessionsSchema, sessions } from '@schemas/sessions.schemas'
import { and, between, countDistinct, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SessionRepository {
    constructor(private readonly db: NodePgDatabase) {}

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

public async getStats(id: number, filters: StatsFilter) {
        const data = await this.db.select({
            os: sessions.os,
            country: sessions.country,
            software: sessions.software,
            location: sessions.location,
        })
        .from(sessions)
        .where(and(
            eq(sessions.source_id, id),
            between(sessions.created_at, new Date(filters.start), new Date(filters.end))
        ))

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

function groupByAndCount(data: any[], key: string) {
    return Object.fromEntries(Object.entries(Object.groupBy(
        data.filter(item => item[key]), 
        (item) => item[key] as string
    ))
    .map(([key, value]) => [key, value?.length || 0]))
}