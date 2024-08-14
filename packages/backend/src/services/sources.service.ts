import { EventsRepository } from '@repositories/events.repositories'
import { NavigationRepository } from '@repositories/navigations.repository'
import { SessionRepository } from '@repositories/sessions.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { DateFilter, MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertSourcesSchema } from '@schemas/sources.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'

export class SourcesService {
    constructor(
        private sourceRepository: SourcesRepository,
        private sessionsRepository: SessionRepository,
        private navigationsRepository: NavigationRepository,
        private eventsRepository: EventsRepository
    ) {}

    public async getAll(query: PaginationSchemaType) {
        return this.sourceRepository.getAll(query)
    }

    public async get(code: string) {
        return this.sourceRepository.get(code)
    }

    public async getIconPath(code: string) {
        return this.sourceRepository.getIconPath(code)
    }

    public async create(data: InsertSourcesSchema, file?: Express.Multer.File) {
        return this.sourceRepository.create({
            ...data,
            icon_path: file?.path
        })
    }

    public async update(code: string, data: InsertSourcesSchema, file?: Express.Multer.File) {
        return this.sourceRepository.update(code, {
            ...data,
            icon_path: file?.path
        })
    }

    public async delete(code: string) {
        return this.sourceRepository.delete(code)
    }

    public async getMetrics(code: string, filters: DateFilter & HeadersTimeZone) {
        const timeZone = filters['x-timezone']
        const { start, end } = rangeDates(filters.date_range)

        return this.navigationsRepository.getMetrics(
            code, 
            {
                start: parseToUTC(start, timeZone),
                end: parseToUTC(end, timeZone),
            }
        )
    }

    public async getStats(code: string, filters: StatsFilter & HeadersTimeZone) {
        const timeZone = filters['x-timezone']

        let promises = []

        if (filters.date_range) {
            const { start, end } = rangeDates(filters.date_range)

            filters.start = start
            filters.end = end
        } else {
            filters.start = parseToUTC(filters.start, timeZone)
            filters.end = parseToUTC(filters.end, timeZone)
        }

        if (filters.stats.some((stat) => ['os', 'software', 'country', 'location'].includes(stat))) {
            promises.push(
                this.sessionsRepository.getStats(code, filters)
            )
        }

        if (filters.stats.includes('navigations')) {
            promises.push(
                this.navigationsRepository.getStats(code, filters)
            )
        }

        if (filters.stats.includes('events')) {
            promises.push(
                this.eventsRepository.getStat(code, filters)
            )
        }

        const data = await Promise.all(promises)

        return data.reduce((acc, item) => ({
            ...acc,
            ...item
        }), {})
    }

    public async getViews(code: string, filters: DateFilter & HeadersTimeZone) {
        const timeZone = filters['x-timezone']
        const { start, end } = rangeDates(filters.date_range)

        return this.navigationsRepository.getViews(
            code, 
            filters.date_range, 
            { 
                start,
                end
            },
            timeZone
        )
    }
}