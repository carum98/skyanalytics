import { sources } from '@schemas/sources.schemas'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SummaryRepository {
	constructor (public readonly db: NodePgDatabase) {}

	public async getData() {
		const data = await this.db.select({
			code: sources.code,
			name: sources.name,
		})
		.from(sources)

		return data
	}
}