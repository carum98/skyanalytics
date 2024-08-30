import { NavigationRepository } from '@repositories/navigations.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { InsertNavigationsSchema } from '@schemas/navigations.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'

export class NavigationsService {
    constructor(private navigationRepository: NavigationRepository) {}

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

        return this.navigationRepository.getAll(query)
    }

    public async get(id: number) {
        return this.navigationRepository.get(id)
    }

    public async create(params: InsertNavigationsSchema) {
        return this.navigationRepository.create(params)
    }

    public async update(id: number, params: any) {
        return this.navigationRepository.update(id, params)
    }

    public async delete(id: number) {
        return this.navigationRepository.delete(id)
    }
}