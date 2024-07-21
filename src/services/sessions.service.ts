import { SessionRepository } from '@repositories/sessions.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { InsertSessionsSchema } from '@schemas/sessions.schemas'

export class SessionService {
    constructor(
        private sessionRepository: SessionRepository,
        private sourceRepository: SourcesRepository,
    ) {}

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