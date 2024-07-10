import { EventsRepository } from '@repositories/events.repositories'

export class EventsService {
    constructor(private eventsRepository: EventsRepository) {}

    public async getAll(): Promise<Object> {
        return this.eventsRepository.getAll()
    }

    public async create(params: any): Promise<Object> {
        await this.eventsRepository.create(params)

        return params
    }
}