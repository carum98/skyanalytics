import { SessionRepository } from '@repositories/sessions.repository'
import { InsertSessionsSchema } from '@schemas/sessions.schemas'

export class SessionService {
    constructor(private sessionRepository: SessionRepository) {}

    public async create(params: InsertSessionsSchema) {
        return this.sessionRepository.create(params)
    }
}