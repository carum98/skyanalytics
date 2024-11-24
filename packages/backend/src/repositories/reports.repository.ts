import { RepositoryCore } from '@core/repository.core'
import { InsertReportsSchema, paginatedReportsSchema, reports, selectReportsSchema, SelectReportsSchema, UpdateReportsSchema } from '@schemas/reports.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { generateCode } from '@utils/code'
import { PaginationSchemaType } from '@utils/pagination'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class ReportsRepository extends RepositoryCore<SelectReportsSchema, InsertReportsSchema & { code: string }, UpdateReportsSchema> {
	constructor(public readonly db: NodePgDatabase) {
		const table = reports

		const select = db.select({
			code: reports.code,
			description: reports.description,
			created_at: reports.created_at,
			status: reports.status,
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

	public async getAll(query: PaginationSchemaType) {
		const data = await this.getAllCore({
			query: query,
			where: undefined
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
}