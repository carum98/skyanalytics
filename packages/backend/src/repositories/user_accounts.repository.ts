import { RepositoryCore } from '@core/repository.core'
import { InsertUserAccountsSchema, paginateUserAccountsSchema, selectUserAccountsSchema, SelectUserAccountsSchema, userAccounts } from '@schemas/user_accounts.schemas'
import { generateCode } from '@utils/code'
import { hashPassword } from '@utils/hash-password'
import { PaginationSchemaType } from '@utils/pagination'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class UserAccountsRepository extends RepositoryCore<SelectUserAccountsSchema, InsertUserAccountsSchema & { code: string }, InsertUserAccountsSchema> {
    constructor (public readonly db: NodePgDatabase) {
        const table = userAccounts

        const select = db.select({
            code: userAccounts.code,
            name: userAccounts.name,
            email: userAccounts.email,
			role: userAccounts.role,
        }).from(table)

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginateUserAccountsSchema.parse(data)
    }

    public async get(code: string) {
        const data = await this.getOneCore({
            where: eq(userAccounts.code, code)
        })

        return selectUserAccountsSchema.parse(data)
    }

    public async create(params: InsertUserAccountsSchema) {
        const code = generateCode()

        const data = await this.insertCore({
            params: {
                ...params,
                password: hashPassword(params.password),
                code,
            }
        })

        return selectUserAccountsSchema.parse(data)
    }

    public async update(code: string, params: InsertUserAccountsSchema) {
        const data = await this.updateCore({
            where: eq(userAccounts.code, code),
            params: {
                ...params,
                password: params.password !== undefined ? hashPassword(params.password) : undefined,
            }
        })

        return selectUserAccountsSchema.parse(data)
    }

    public async delete(code: string) {
        return this.deleteCore(eq(userAccounts.code, code))
    }

    public async getPassword(email: string) {
        const data = await this.db.select({
            id: userAccounts.id,
            code: userAccounts.code,
            name: userAccounts.name,
			role: userAccounts.role,
            password: userAccounts.password
        })
        .from(userAccounts)
        .where(eq(userAccounts.email, email))

        return data.at(0)
    }
}