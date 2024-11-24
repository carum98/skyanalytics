import { RepositoryCore } from '@core/repository.core'
import { FilterSessions, MetricsFilter } from '@schemas/_query'
import { InsertReportsSchema, paginatedReportsSchema, reports, selectReportsSchema, SelectReportsSchema, UpdateReportsSchema } from '@schemas/reports.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { generateCode } from '@utils/code'
import { groupByRangeDates } from '@utils/group-by-range-dates'
import { PaginationSchemaType } from '@utils/pagination'
import { DateRange } from '@utils/range-dates'
import { and, between, count, eq, isNull } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class ReportsRepository extends RepositoryCore<SelectReportsSchema, InsertReportsSchema & { code: string }, UpdateReportsSchema> {
	constructor(public readonly db: NodePgDatabase) {
		const table = reports

		const select = db.select({
			code: reports.code,
			description: reports.description,
			created_at: reports.created_at,
			status: reports.status,
			metadata: reports.metadata,
            session: {
                os: sessions.os,
                software: sessions.software,
                country: sessions.country,
            },
			source: {
				code: sources.code,
				name: sources.name,
				icon_path: sources.icon_path
			}
        })
        .from(table)
        .leftJoin(sessions, eq(reports.session_id, sessions.id))
        .leftJoin(sources, eq(sessions.source_id, sources.id))

		super({ db, table, select })
	}

	public async getAll(query: PaginationSchemaType & FilterSessions) {
		const data = await this.getAllCore({
			query: query,
			where: query.start && query.end
                ? between(reports.created_at, new Date(query.start), new Date(query.end))
                : undefined,
		})

		return paginatedReportsSchema.parse(data)
	}

	public async get(code: string) {
		const data = await this.getOneCore({
			where: eq(reports.code, code)
		})

		return selectReportsSchema.parse(data)
	}

	public async create(params: InsertReportsSchema) {
		const code = generateCode()

		const data = await this.insertCore({
			params: {
				...params,
				code
			}
		})

		return selectReportsSchema.parse(data)
	}

	public async update(code: string, params: UpdateReportsSchema) {
		const data = await this.updateCore({
			where: eq(reports.code, code),
			params
		})

		return selectReportsSchema.parse(data)
	}

	public async delete(code: string) {
		return this.deleteCore(eq(reports.code, code))
	}

	public async getMetrics(sourceCode: string) {
		const data = await this.db.select({
			reports: count(reports.id)
		})
		.from(reports)
		.leftJoin(sessions, eq(reports.session_id, sessions.id))
		.leftJoin(sources, eq(sessions.source_id, sources.id))
		.where(
			and(
				eq(reports.status, 'open'),
				eq(sources.code, sourceCode),
				isNull(reports.deleted_at),
			)
		)

		return data.at(0)
	}

	public async getByDays(code: string, dateRange: DateRange, filters: Omit<MetricsFilter, 'date_range'>, timezone: string) {
		const data = await this.db.select({
			code: reports.code,
			created_at: reports.created_at,
		})
		.from(reports)
		.leftJoin(sessions, eq(reports.session_id, sessions.id))
		.leftJoin(sources, eq(sessions.source_id, sources.id))
		.where(and(
            eq(sources.code, code),
			isNull(reports.deleted_at),
            between(reports.created_at, new Date(filters.start), new Date(filters.end))
        ))

		return groupByRangeDates(
			data,
			dateRange,
			filters,
			timezone,
			(items) => ({
				reports: items?.length || 0
			})
		)
	}
}