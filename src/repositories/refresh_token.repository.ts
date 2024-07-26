import { InsertRefreshTokenSchema, refreshToken, selectRefreshTokenSchema } from '@schemas/refresh_token.schemas'
import { userAccounts } from '@schemas/user_accounts.schemas'
import { DatabaseError } from '@utils/errors'
import { count, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class RefreshTokenRepository {
    constructor (public readonly db: NodePgDatabase) {}

    public async upsert(params: InsertRefreshTokenSchema) {
        const data = await this.db.select({
            count: count()    
        })
        .from(refreshToken)
        .where(eq(refreshToken.user_account_id, params.user_account_id))
        
        if (data.at(0)?.count === 0) {
            return this.create(params)
        } else {
            return this.update(params)
        }
    }

    public async create(params: InsertRefreshTokenSchema) {
        const data = await this.db.insert(refreshToken)
            .values(params)
            .returning()

        if (data.length === 0) {
            throw DatabaseError.fromMessage('Not Created', 404)
        }

        return selectRefreshTokenSchema.parse(data.at(0))
    }

    public async update(params: InsertRefreshTokenSchema) {
        const data = await this.db.update(refreshToken)
            .set(params)
            .where(eq(refreshToken.user_account_id, params.user_account_id))
            .returning()

        if (data.length === 0) {
            throw DatabaseError.fromMessage('Not Updated', 404)
        }

        return selectRefreshTokenSchema.parse(data.at(0))
    }

    public async get(token: string) {
        const data = await this.db.select({
            id: refreshToken.id,
            userAccount: {
                id: userAccounts.id,
                code: userAccounts.code,
                name: userAccounts.name,
                email: userAccounts.email
            }
        })
        .from(refreshToken)
        .leftJoin(userAccounts, eq(refreshToken.user_account_id, userAccounts.id))
        .where(eq(refreshToken.token, token))

        return data.at(0)
    }

    public async delete(token: string) {
        return this.db.delete(refreshToken)
            .where(eq(refreshToken.token, token))
    }
}