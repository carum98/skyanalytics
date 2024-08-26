import { SessionRepository } from '@repositories/sessions.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { filterSessions, FilterSessions } from '@schemas/_query'
import { InsertSessionsSchema } from '@schemas/sessions.schemas'
import { PaginationSchema, PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'

export class SessionService {
    constructor(
        private sessionRepository: SessionRepository,
        private sourceRepository: SourcesRepository,
    ) {}

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

        return this.sessionRepository.getAll(query)
    }

    public async create(params: Omit<InsertSessionsSchema, 'source_id'> & { source_key: string }) {
        const source = await this.sourceRepository.find(params.source_key)

        return this.sessionRepository.create({
            ...params,
            source_id: source.id
        })
    }

    public async find(uuid: string) {
        return this.sessionRepository.find(uuid)
    }
}