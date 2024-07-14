import { SourcesRepository } from '@repositories/sources.repository'
import { PaginationSchemaType } from '@utils/pagination'

export class SourcesService {
    constructor(private eventsRepository: SourcesRepository) {}

    public async getAll(query: PaginationSchemaType) {
        return this.eventsRepository.getAll(query)
    }

    public async get(id: number) {
        return this.eventsRepository.get(id)
    }

    public async create(data: any) {
        return this.eventsRepository.create(data)
    }

    public async update(id: number, data: any) {
        return this.eventsRepository.update(id, data)
    }

    public async delete(id: number) {
        return this.eventsRepository.delete(id)
    }
}