import { RepositoryCore } from '@core/repository.core'
import { FilterSessions, MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertNavigationsSchema, navigations, paginatedNavigationsSchema, selectNavigationsSchema, SelectNavigationsSchema } from '@schemas/navigations.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { groupByAndCount } from '@utils/group-and-count'
import { groupByRangeDates } from '@utils/group-by-range-dates'
import { PaginationSchemaType } from '@utils/pagination'
import { DateRange } from '@utils/range-dates'
import { and, between, count, countDistinct, eq, isNotNull } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class NavigationRepository extends RepositoryCore<SelectNavigationsSchema, InsertNavigationsSchema, InsertNavigationsSchema>{
    constructor(public readonly db: NodePgDatabase) {
        const table = navigations

        const select = db.select({
            id: navigations.id,
            name: navigations.name,
            created_at: navigations.created_at,
			metadata: navigations.metadata,
            session: {
                os: sessions.os,
                software: sessions.software,
                country: sessions.country,
            },
        })
        .from(table)
        .leftJoin(sessions, eq(navigations.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType & FilterSessions) {
        const data = await this.getAllCore({
            query: query,
            where: query.start && query.end
                ? between(navigations.created_at, new Date(query.start), new Date(query.end))
                : undefined,
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

    public async getMetrics(code: string, filters: Omit<MetricsFilter, 'date_range'>) {
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

    public async getViews(code: string, dateRange: DateRange, filters: Omit<MetricsFilter, 'date_range'>, timezone: string) {
        const data = await this.db.select({
            navigations_id: navigations.id,
            created_at: navigations.created_at,
            session_id: sessions.id,
        })
        .from(navigations)
        .leftJoin(sessions, eq(navigations.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(and(
            eq(sources.code, code),
            between(navigations.created_at, new Date(filters.start), new Date(filters.end))
        ))

        return groupByRangeDates(data, dateRange, filters, timezone)
    }

	public async getStatsMetadata(code: string, filters: StatsFilter) {
		const data = await this.db.select({
			metadata: navigations.metadata,
        })
        .from(navigations)
        .leftJoin(sessions, eq(navigations.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(
            and(
                eq(sources.code, code),
                between(navigations.created_at, new Date(filters.start), new Date(filters.end)),
				isNotNull(navigations.metadata)
            )
        )

		// Get all keys from metadata availables
        const keys = Array.from(new Set(data.flatMap(item => Object.keys(item.metadata as object))))

		// Group by metadata keys and count
		// Remove undefined keys
		const values = keys.map(key => ({
			[key]: Object.fromEntries(
				Object.entries(groupByAndCount(data, `metadata.${key}`))
				.filter(([key, _]) => key !== 'undefined')
			)
		}))

		return {
			metadata: Object.assign({}, ...values)
		}
	}
}