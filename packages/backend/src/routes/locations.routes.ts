import { LocationsController } from '@controllers/locations.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { headersTimezoneSchema } from '@schemas/_headers'
import { LocationsService } from '@services/locations.service'

export class LocationsRouter extends RouterCore {
	constructor(di: DepencyInjection) {
		super({
			path: '/locations',
			middlewares: [authMiddleware]
		})

		const service = di.resolve(LocationsService)
        const controller = new LocationsController(service)

        this.get({
            name: '/',
            handler: controller.getAll,
            middlewares: [
                requestMiddleware({
                    headers: headersTimezoneSchema,
                })
            ]
        })
	}
}
