import { NavigationRepository } from '@repositories/navigations.repository'
import { InsertNavigationsSchema } from '@schemas/navigations.schemas'
import { PaginationSchemaType } from '@utils/pagination'

export class NavigationsService {
    constructor(private navigationRepository: NavigationRepository) {}

    public async getAll(query: PaginationSchemaType) {
        return this.navigationRepository.getAll(query)
    }

    public async get(id: number) {
        return this.navigationRepository.get(id)
    }

    public async create(params: InsertNavigationsSchema) {
        return this.navigationRepository.create(params)
    }

    public async update(id: number, params: any) {
        return this.navigationRepository.update(id, params)
    }

    public async delete(id: number) {
        return this.navigationRepository.delete(id)
    }
}