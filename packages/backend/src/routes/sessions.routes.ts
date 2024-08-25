import { SessionsController } from '@controllers/sessions.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { SessionService } from '@services/sessions.service'
import { PaginationSchema } from '@utils/pagination'

export class SessionsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/sessions',
            middlewares: [authMiddleware]
        })

        const service = di.resolve(SessionService)
        const controller = new SessionsController(service)

        this.get({
            name: '/',
            handler: controller.getAll,
            middlewares: [
                requestMiddleware({
                    query: PaginationSchema
                })
            ]
        })
    }
}