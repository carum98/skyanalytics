import { ViewsController } from '@controllers/views.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { sessionMiddleware } from '@middlewares/session.middleware'
import { headersSourceSchema, headerXRealIPSchema } from '@schemas/_headers'
import { insertViewsSchema } from '@schemas/views.schemas'
import { ViewsService } from '@services/views.service'
import { SessionService } from '@services/sessions.service'
import { PaginationSchema } from '@utils/pagination'

export class ViewsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/views',
            middlewares: [authMiddleware]
        })

        const service = di.resolve(ViewsService)
        const controller = new ViewsController(service)

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
                    headers: headerXRealIPSchema.merge(headersSourceSchema),
                    body: insertViewsSchema.pick({ name: true })
                }),
                sessionMiddleware(di.resolve(SessionService)),
            ]
        })

        this.get({
            name: '/:id',
            handler: controller.get
        })

        this.put({
            name: '/:id',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    body: insertViewsSchema.partial()
                })
            ]
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
    }
}