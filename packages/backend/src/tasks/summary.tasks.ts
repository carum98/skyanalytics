import { DepencyInjection } from '@core/di.core'
import { TasksCore } from '@core/tasks.core'
import { SummaryService } from '@services/summary.service'

export class SummaryTask extends TasksCore {
	constructor(di: DepencyInjection) {
		super({
			name: 'SummaryTask',
			schedule: '0 0 * * 1', // Every Monday at 00:00
			task: async (params) => {
				const service = di.resolve(SummaryService)
				return await service.sendEmail(params as Record<string, any>)
			}
		})
	}
}