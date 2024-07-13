import { RepositoryCore } from '@core/repository.core'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { sources, SelectSourcesSchema, InsertSourcesSchema } from 'src/schemas/sources.schemas'

export class SourcesRepository extends RepositoryCore<SelectSourcesSchema, InsertSourcesSchema, InsertSourcesSchema> {
    constructor (public readonly db: NodePgDatabase) {
        const table = sources

        const select = db.select().from(table)

        super({ db, table, select })
    }

    public async getAll() {
        return this.getAllCore({
            query: {
                page: 1,
                per_page: 10,
                sort_by: 'id',
                sort_order: 'asc'
            },
            where: undefined
        })
    }

    public async get(id: number) {
        return this.getOneCore({
            where: eq(sources.id, id)
        })
    }

    public async create(params: InsertSourcesSchema) {
        return this.insertCore({
            params
        })
    }

    public async update(id: number, params: InsertSourcesSchema) {
        return this.updateCore({
            where: eq(sources.id, id),
            params
        })
    }

    public async delete(id: number): Promise<void> {
        await this.deleteCore(eq(sources.id, id))
    }
}