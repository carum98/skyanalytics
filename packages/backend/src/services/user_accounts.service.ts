import { UserAccountsRepository } from '@repositories/user_accounts.repository'
import { InsertUserAccountsSchema } from '@schemas/user_accounts.schemas'
import { PaginationSchemaType } from '@utils/pagination'

export class UserAccountsService {
    constructor(
        private userAccountsRepository: UserAccountsRepository,
    ) {}

    public async getAll(query: PaginationSchemaType) {
        return this.userAccountsRepository.getAll(query)
    }

    public async get(code: string) {
        return this.userAccountsRepository.get(code)
    }

    public async create(data: InsertUserAccountsSchema) {
        return this.userAccountsRepository.create(data)
    }

    public async update(code: string, data: any) {
        return this.userAccountsRepository.update(code, data)
    }

    public async delete(code: string) {
        return this.userAccountsRepository.delete(code)
    }

    public async getOptions() {
        return this.userAccountsRepository.getOptions()
    }
}
