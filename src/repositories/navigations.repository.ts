import { RepositoryCore } from '@core/repository.core'
import { InsertNavigationsSchema, navigations, paginatedNavigationsSchema, selectNavigationsSchema, SelectNavigationsSchema } from '@schemas/navigations.schemas'
import { PaginationSchemaType } from '@utils/pagination'
import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class NavigationRepository extends RepositoryCore<SelectNavigationsSchema, InsertNavigationsSchema, InsertNavigationsSchema>{
    constructor(public readonly db: NodePgDatabase) {
        const table = navigations

        const select = db.select({
            id: navigations.id,
            name: navigations.name,
        })
        .from(table)

        super({ db, table, select })
    }

    public async getAll(query: PaginationSchemaType) {
        const data = await this.getAllCore({
            query: query,
            where: undefined
        })

        return paginatedNavigationsSchema.parse(data)
    }

    public async get(id: number) {
        const data = await this.getOneCore({
            where: eq(navigations.id, id)
        })

        return selectNavigationsSchema.parse(data)
    }

    public async create(params: InsertNavigationsSchema) {
        const data = await this.insertCore({
            params
        })

        return selectNavigationsSchema.parse(data)
    }

    public async update(id: number, params: any) {
        const data = await this.updateCore({
            where: eq(navigations.id, id),
            params
        })

        return selectNavigationsSchema.parse(data)
    }

    public async delete(id: number) {
        return this.deleteCore(eq(navigations.id, id))
    }
}