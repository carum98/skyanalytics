import { RepositoryCore } from '@core/repository.core'
import { FilterSessions, MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertViewsSchema, views, paginatedViewsSchema, selectViewsSchema, SelectViewsSchema } from '@schemas/views.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { groupByAndCount } from '@utils/group-and-count'
import { groupByRangeDates } from '@utils/group-by-range-dates'
import { PaginationSchemaType } from '@utils/pagination'
import { DateRange } from '@utils/range-dates'
import { and, between, count, countDistinct, eq, isNotNull } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class ViewsRepository extends RepositoryCore<SelectViewsSchema, InsertViewsSchema, InsertViewsSchema>{
    constructor(public readonly db: NodePgDatabase) {
        const table = views

        const select = db.select({
            id: views.id,
            name: views.name,
            created_at: views.created_at,
			metadata: views.metadata,
            session: {
                os: sessions.os,
                software: sessions.software,
                country: sessions.country,
            },
        })
        .from(table)
        .leftJoin(sessions, eq(views.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType & FilterSessions) {
        const data = await this.getAllCore({
            query: query,
            where: query.start && query.end
                ? between(views.created_at, new Date(query.start), new Date(query.end))
                : undefined,
        })

        return paginatedViewsSchema.parse(data)
    }

    public async get(id: number) {
        const data = await this.getOneCore({
            where: eq(views.id, id)
        })

        return selectViewsSchema.parse(data)
    }

    public async create(params: InsertViewsSchema) {
        const data = await this.insertCore({
            params
        })

        return selectViewsSchema.parse(data)
    }

    public async update(id: number, params: any) {
        const data = await this.updateCore({
            where: eq(views.id, id),
            params
        })

        return selectViewsSchema.parse(data)
    }

    public async delete(id: number) {
        return this.deleteCore(eq(views.id, id))
    }

    public async getMetrics(code: string, filters: Omit<MetricsFilter, 'date_range'>) {
        const data = await this.db.select({
            views: count(),
            visitors: countDistinct(sessions.uuid),
        })
        .from(views)
        .leftJoin(sessions, eq(views.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(and(
            eq(sources.code, code),
            between(views.created_at, new Date(filters.start), new Date(filters.end))
        ))

        return data.at(0)
    }

    public async getStats(code: string, filters: StatsFilter) {
        const data = await this.db.select({
            name: views.name,
            count: count(views.name)
        })
        .from(views)
        .leftJoin(sessions, eq(views.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(
            and(
                eq(sources.code, code),
                between(views.created_at, new Date(filters.start), new Date(filters.end))
            )
        )
        .groupBy(views.name)

        return {
            navigations: Object.fromEntries(data.map(item => [item.name, item.count]))
        }
    }

    public async getViews(code: string, dateRange: DateRange, filters: Omit<MetricsFilter, 'date_range'>, timezone: string) {
        const data = await this.db.select({
            views_id: views.id,
            created_at: views.created_at,
            session_id: sessions.id,
        })
        .from(views)
        .leftJoin(sessions, eq(views.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(and(
            eq(sources.code, code),
            between(views.created_at, new Date(filters.start), new Date(filters.end))
        ))

        return groupByRangeDates(data, dateRange, filters, timezone)
    }

	public async getStatsMetadata(code: string, filters: StatsFilter) {
		const data = await this.db.select({
			metadata: views.metadata,
        })
        .from(views)
        .leftJoin(sessions, eq(views.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))
        .where(
            and(
                eq(sources.code, code),
                between(views.created_at, new Date(filters.start), new Date(filters.end)),
				isNotNull(views.metadata)
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