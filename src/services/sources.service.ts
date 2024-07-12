import { SourcesRepository } from '@repositories/sources.repository'

export class SourcesService {
    constructor(private eventsRepository: SourcesRepository) {}

    public async getAll() {
        return this.eventsRepository.getAll()
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