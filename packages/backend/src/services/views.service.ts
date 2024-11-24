import { ViewsRepository } from '@repositories/views.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { InsertViewsSchema } from '@schemas/views.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'

export class ViewsService {
    constructor(private viewsRepository: ViewsRepository) {}

    public async getAll(query: PaginationSchemaType & FilterSessions & HeadersTimeZone) {
        const timeZone = query['x-timezone']

        if (query.start && query.end) {
            query.start = parseToUTC(query.start, timeZone)
            query.end = parseToUTC(query.end, timeZone)
        }

        if (query.date_range && !query.start && !query.end) {
            const { start, end } = rangeDates(query.date_range)

            query.start = start
            query.end = end
        } 

        return this.viewsRepository.getAll(query)
    }

    public async get(id: number) {
        return this.viewsRepository.get(id)
    }

    public async create(params: InsertViewsSchema) {
        return this.viewsRepository.create(params)
    }

    public async update(id: number, params: any) {
        return this.viewsRepository.update(id, params)
    }

    public async delete(id: number) {
        return this.viewsRepository.delete(id)
    }
}