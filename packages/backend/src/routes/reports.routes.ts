import { ReportsController } from '@controllers/reports.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { insertReportsSchema, updateReportsSchema } from '@schemas/reports.schemas'
import { ReportsService } from '@services/reports.service'
import { PaginationSchema } from '@utils/pagination'

export class ReportsRouter extends RouterCore {
	constructor(di: DepencyInjection) {
		super({
			path: '/reports',
			middlewares: [authMiddleware]
		})

		const service = di.resolve(ReportsService)
        const controller = new ReportsController(service)

		this.get({
			name: '/',
			handler: controller.getAll,
			middlewares: [
				requestMiddleware({
					query: PaginationSchema
				})
			]
		})

		this.post({
			name: '/',
			handler: controller.create,
			middlewares: [
				requestMiddleware({
					body: insertReportsSchema
				}),
			]
		})

		this.get({
			name: '/:code',
			handler: controller.get
		})

		this.put({
			name: '/:code',
			handler: controller.update,
			middlewares: [
				requestMiddleware({
					body: updateReportsSchema
				})
			]
		})

		this.delete({
			name: '/:code',
			handler: controller.delete
		})

		this.get({
			name: '/:code/send-email',
			handler: controller.sendEmail
		})
	}
}