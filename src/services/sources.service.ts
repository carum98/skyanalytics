import { EventsRepository } from '@repositories/events.repositories'
import { NavigationRepository } from '@repositories/navigations.repository'
import { SessionRepository } from '@repositories/sessions.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertSourcesSchema } from '@schemas/sources.schemas'
import { PaginationSchemaType } from '@utils/pagination'

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

    public async create(data: InsertSourcesSchema) {
        return this.sourceRepository.create(data)
    }

    public async update(code: string, data: any) {
        return this.sourceRepository.update(code, data)
    }

    public async delete(code: string) {
        return this.sourceRepository.delete(code)
    }

    public async getMetrics(code: string, filters: MetricsFilter) {
        return this.navigationsRepository.getMetrics(code, filters)
    }

    public async getStats(code: string, filters: StatsFilter) {
        let promises = []

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
}