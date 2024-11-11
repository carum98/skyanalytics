import { SettingsController } from '@controllers/settings.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { SettingsRepository } from '@repositories/settings.repository'
import { paramsSettingsKey } from '@schemas/_params'

export class SettingsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/settings',
            middlewares: [authMiddleware]
        })

        const repository = di.resolve(SettingsRepository)
		const controller = new SettingsController(repository)

		this.get({
			name: '/:key',
			handler: controller.get,
			middlewares: [
				requestMiddleware({
					params: paramsSettingsKey
				})
			]
		})

		this.post({
			name: '/:key',
			handler: controller.update,
			middlewares: [
				requestMiddleware({
					params: paramsSettingsKey,
				})
			]
		})
	}
}