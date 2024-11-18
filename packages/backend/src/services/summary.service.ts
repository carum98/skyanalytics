import { SettingsRepository } from '@repositories/settings.repository'
import { SummaryRepository } from '@repositories/summary.repository'
import { sendEmail } from '@utils/emails'

export class SummaryService {
	constructor(
		private summaryRepository: SummaryRepository,
		private settingsRepository: SettingsRepository
	) {}

	public async sendEmail(params: Record<string, any>) {
		const config = await this.settingsRepository.getSummaryEmail()

		if (!config.enabled) {
			return { message: 'Emails are disabled' }
		}

		if (!config.users.length) {
			return { message: 'No users to send email' }
		}

		const data = await this.summaryRepository.getData(config.date_range.value)

		return sendEmail({
			to: config.users,
			subject: 'SkyAnalytics -- Summary',
			template: 'summary',
			data: {
				data
			},
			onlyHtml: params.onlyHtml
		})
	}
}