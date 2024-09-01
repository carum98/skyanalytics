import { SessionRepository } from '@repositories/sessions.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'

export class LocationsService {
    constructor(
        private sessionsRepository: SessionRepository,
    ) {}

    public async getAll(query: FilterSessions & HeadersTimeZone) {
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

        return this.sessionsRepository.getLocations(query)
    }
}