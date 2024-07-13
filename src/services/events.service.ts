import { EventsRepository } from '@repositories/events.repositories'

export class EventsService {
    constructor(private eventsRepository: EventsRepository) {}

    public async getAll() {
        return this.eventsRepository.getAll()
    }

    public async create(params: any) {
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