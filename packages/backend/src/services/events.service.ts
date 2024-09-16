import { EventsRepository } from '@repositories/events.repositories'
import { HeadersTimeZone } from '@schemas/_headers'
import { MetricsFilter } from '@schemas/_query'
import { InsertEventsSchema } from '@schemas/events.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'

export class EventsService {
    constructor(private eventsRepository: EventsRepository) {}

    public async getAll(query: PaginationSchemaType & MetricsFilter & HeadersTimeZone) {
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

        return this.eventsRepository.getAll(query)
    }

    public async create(params: InsertEventsSchema) {
        return this.eventsRepository.create(params)
    }

    public async get(id: number) {
        return this.eventsRepository.get(id)
    }

    public async update(id: number, params: any) {
        return this.eventsRepository.update(id, params)
    }

    public async delete(id: number) {
        return this.eventsRepository.delete(id)
    }
}