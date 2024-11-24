import { ReportsRepository } from '@repositories/reports.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { InsertReportsSchema, UpdateReportsSchema } from '@schemas/reports.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToTimeZone, parseToUTC } from '@utils/time-zones'

export class ReportsService {
	constructor(private reportsRepository: ReportsRepository) {}

	async getAll(query: PaginationSchemaType & FilterSessions & HeadersTimeZone) {
		const timeZone = query['x-timezone'] || 'UTC-0'

        if (query.start && query.end) {
            query.start = parseToUTC(query.start, timeZone)
            query.end = parseToUTC(query.end, timeZone)
        }

        if (query.date_range && !query.start && !query.end) {
            const { start, end } = rangeDates(query.date_range)

            query.start = start
            query.end = end
        } 

		const response = await this.reportsRepository.getAll(query)
		if (timeZone === undefined) return response

		const { data, pagination } = response
		return {
			data: data.map(({ created_at, ...rest }) => ({
				...rest,
				created_at: parseToTimeZone(created_at, timeZone),
			})),
			pagination,
		}
	}

	async get(code: string) {
		return this.reportsRepository.get(code)
	}

	async create(params: InsertReportsSchema) {
		return this.reportsRepository.create(params)
	}

	async update(code: string, params: UpdateReportsSchema) {
		return this.reportsRepository.update(code, params)
	}

	async delete(code: string) {
		return this.reportsRepository.delete(code)
	}
}