import { EventsRepository } from '@repositories/events.repositories'
import { NavigationRepository } from '@repositories/navigations.repository'
import { SessionRepository } from '@repositories/sessions.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { MetricsFilter, StatsFilter } from '@schemas/_query'
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

    public async get(id: number) {
        return this.sourceRepository.get(id)
    }

    public async create(data: any) {
        return this.sourceRepository.create(data)
    }

    public async update(id: number, data: any) {
        return this.sourceRepository.update(id, data)
    }

    public async delete(id: number) {
        return this.sourceRepository.delete(id)
    }

    public async getMetrics(id: number, filters: MetricsFilter) {
        return this.navigationsRepository.getMetrics(id, filters)
    }

    public async getStats(id: number, filters: StatsFilter) {
        let promises = []

        if (filters.stats.some((stat) => ['os', 'software', 'country', 'location'].includes(stat))) {
            promises.push(
                this.sessionsRepository.getStats(id, filters)
            )
        }

        if (filters.stats.includes('navigations')) {
            promises.push(
                this.navigationsRepository.getStats(id, filters)
            )
        }

        if (filters.stats.includes('events')) {
            promises.push(
                this.eventsRepository.getStat(id, filters)
            )
        }

        const data = await Promise.all(promises)

        return data.reduce((acc, item) => ({
            ...acc,
            ...item
        }), {})
    }
}