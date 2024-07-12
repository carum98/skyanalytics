import { eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { sources, SelectSourcesSchema, InsertSourcesSchema } from 'src/schemas/sources.schemas'

export class SourcesRepository {
    constructor (private db: NodePgDatabase) {}

    public async getAll(): Promise<SelectSourcesSchema[]> {
        const data = await this.db.select().from(sources)

        return data
    }

    public async create(params: InsertSourcesSchema): Promise<SelectSourcesSchema | undefined> {
        const data = await this.db.insert(sources).values(params).returning()

        return data.at(0)
    }

    public async update(id: number, params: InsertSourcesSchema): Promise<SelectSourcesSchema | undefined> {
        const data = await this.db.update(sources).set(params).where(eq(sources.id, id)).returning()

        return data.at(0)
    }

    public async delete(id: number): Promise<void> {
        await this.db.delete(sources).where(eq(sources.id, id))
    }
}