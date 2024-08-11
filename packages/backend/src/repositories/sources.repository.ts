import { RepositoryCore } from '@core/repository.core'
import { PaginationSchemaType } from '@utils/pagination'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { sources, SelectSourcesSchema, InsertSourcesSchema, paginateSourcesSchema, selectSourcesSchema } from '@schemas/sources.schemas'
import { uuidGenerator } from '@utils/uuid'
import { DatabaseError } from '@utils/errors'
import { generateCode } from '@utils/code'

export class SourcesRepository extends RepositoryCore<SelectSourcesSchema, InsertSourcesSchema & { key: string, code: string }, InsertSourcesSchema> {
    constructor (public readonly db: NodePgDatabase) {
        const table = sources

        const select = db.select({
            code: sources.code,
            name: sources.name,
            key: sources.key,
            icon_path: sources.icon_path,
        }).from(table)

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginateSourcesSchema.parse(data)
    }

    public async get(code: string) {
        const data = await this.getOneCore({
            where: eq(sources.code, code)
        })

        return selectSourcesSchema.parse(data)
    }

    public async getIconPath(code: string) {
        const data = await this.db.select({
            icon_path: sources.icon_path
        })
        .from(sources)
        .where(eq(sources.code, code))

        return data?.at(0)?.icon_path
    }

    public async create(params: InsertSourcesSchema & { icon_path?: string }) {
        const key = uuidGenerator()
        const code = generateCode()

        const data = await this.insertCore({
            params: {
                ...params,
                key,
                code,
            }
        })

        return selectSourcesSchema.parse(data)
    }

    public async update(code: string, params: InsertSourcesSchema & { icon_path?: string }) {
        const data = await this.updateCore({
            where: eq(sources.code, code),
            params
        })

        return selectSourcesSchema.parse(data)
    }

    public async delete(code: string) {
        return this.deleteCore(eq(sources.code, code))
    }

    public async find(key: string) {
        const data = await this.db.select()
            .from(sources)
            .where(eq(sources.key, key))

        if (!data.length) {
            throw DatabaseError.fromMessage('Not Found', 404)
        }

        return data.at(0)!
    }
}