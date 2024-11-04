import { SummaryRepository } from '@repositories/summary.repository'
import { sendEmail } from '@utils/emails'

export class SummaryService {
	constructor(
		private summaryRepository: SummaryRepository,
	) {}

	public async sendEmail() {
		const data = await this.summaryRepository.getData()

		return sendEmail({
			to: '',
			subject: 'SkyAnalytics -- Summary',
			template: 'summary',
			data: {
				summary: data
			}
		})
	}
}