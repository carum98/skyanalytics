import { NavigationController } from '@controllers/navigations.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { sessionMiddleware } from '@middlewares/session.middleware'
import { headersSourceSchema, headerXRealIPSchema } from '@schemas/_headers'
import { insertNavigationsSchema } from '@schemas/navigations.schemas'
import { NavigationsService } from '@services/navigations.service'
import { SessionService } from '@services/sessions.service'
import { PaginationSchema } from '@utils/pagination'

export class NavigationsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/navigations',
        })

        const service = di.resolve(NavigationsService)
        const controller = new NavigationController(service)

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
                    body: insertNavigationsSchema.pick({ name: true })
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
                    body: insertNavigationsSchema.partial()
                })
            ]
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
    }
}