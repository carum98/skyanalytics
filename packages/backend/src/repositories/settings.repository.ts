import { settings, SettingsKey, SummaryEmailSchema, selectSettingsSchema } from '@schemas/settings.schemas'
import { userAccounts } from '@schemas/user_accounts.schemas'
import { eq, inArray } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SettingsRepository {
	constructor (public readonly db: NodePgDatabase) {}

	public async get(key: SettingsKey) {
		if (key === 'email_summary') {
			return this.getSummaryEmail()
		}

		return this.getSettings(key)
	}

	public async getSummaryEmail() {
		const jsonConfig = await this.getSettings('email_summary')

		const data = SummaryEmailSchema.parse(jsonConfig)

		const emails = data.users.length ? await this.db.select({
			email: userAccounts.email
		})
		.from(userAccounts)
		.where(inArray(userAccounts.id, data.users)) : []

		return {
			...data,
			users: emails.map((email) => email.email)
		}
	}

	public async updateSettings(key: SettingsKey, data: Record<string, any>) {
		const value = await this.db.insert(settings)
			.values({ key, data })
			.onConflictDoUpdate({
				target: settings.key,
				set: {
					data
				}
			})
			.returning()

		return selectSettingsSchema.parse(value.at(0))
	}

	async getSettings(key: SettingsKey) {
		const data = await this.db.select({
			key: settings.key,
			data: settings.data,
		})
		.from(settings)
		.where(
			eq(settings.key, key)
		)

		return data.at(0)?.data
	}
}