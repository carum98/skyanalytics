import { EventsRepository } from '@repositories/events.repositories'
import { ViewsRepository } from '@repositories/views.repository'
import { SessionRepository } from '@repositories/sessions.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertSourcesSchema } from '@schemas/sources.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToUTC } from '@utils/time-zones'
import { ReportsRepository } from '@repositories/reports.repository'

export class SourcesService {
    constructor(
        private sourceRepository: SourcesRepository,
        private sessionsRepository: SessionRepository,
        private viewsRepository: ViewsRepository,
        private eventsRepository: EventsRepository,
        private reportsRepository: ReportsRepository
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

    public async getMetrics(code: string, filters: MetricsFilter & HeadersTimeZone) {
        const timeZone = filters['x-timezone']
        const { start, end } = rangeDates(filters.date_range)

        const [views, reports] = await Promise.all([
            this.viewsRepository.getMetrics(code, {
                    start: parseToUTC(start, timeZone),
                    end: parseToUTC(end, timeZone),
                }
            ),
            this.reportsRepository.getMetrics(code)
        ])

        return {
            ...views,
            ...reports
        }
    }

    public async getStats(code: string, filters: StatsFilter & HeadersTimeZone) {
        const timeZone = filters['x-timezone']

        let promises = []

        if (filters.start && filters.end) {
            filters.start = parseToUTC(filters.start, timeZone)
            filters.end = parseToUTC(filters.end, timeZone)
        }

        if (filters.date_range && !filters.start && !filters.end) {
            const { start, end } = rangeDates(filters.date_range)

            filters.start = start
            filters.end = end
        } 

        if (filters.stats.some((stat) => ['os', 'software', 'country', 'location'].includes(stat))) {
            promises.push(
                this.sessionsRepository.getStats(code, filters)
            )
        }

        if (filters.stats.includes('navigations')) {
            promises.push(
                this.viewsRepository.getStats(code, filters)
            )
        }

        if (filters.stats.includes('events')) {
            promises.push(
                this.eventsRepository.getStat(code, filters)
            )
        }

		if (filters.stats.includes('metadata')) {
			promises.push(
				this.viewsRepository.getStatsMetadata(code, filters)
			)
		}

        const data = await Promise.all(promises)

        return data.reduce((acc, item) => ({
            ...acc,
            ...item
        }), {})
    }

    public async getViews(code: string, filters: MetricsFilter & HeadersTimeZone) {
        const timeZone = filters['x-timezone']

        if (filters.start && filters.end) {
            filters.start = parseToUTC(filters.start, timeZone)
            filters.end = parseToUTC(filters.end, timeZone)
        }

        if (filters.date_range && !filters.start && !filters.end) {
            const { start, end } = rangeDates(filters.date_range)

            filters.start = start
            filters.end = end
        } 

        const [views, reports] = await Promise.all([
            this.viewsRepository.getViews(
                code, 
                filters.date_range, 
                filters,
                timeZone
            ),
            this.reportsRepository.getByDays(
                code, 
                filters.date_range, 
                filters, 
                timeZone
            )
        ])

        // Join views and reports.
        const data = Object.entries(views).map(([date, view]) => {
            return [date, {
                ...view,
                reports: reports[date].reports || 0
            }]
        })

        return Object.fromEntries(data)
    }
}