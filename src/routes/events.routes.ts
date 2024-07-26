import { EventsController } from '@controllers/events.controllers'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { sessionMiddleware } from '@middlewares/session.middleware'
import { headersSourceSchema, headerXRealIPSchema } from '@schemas/_headers'
import { insertEventsSchema } from '@schemas/events.schemas'
import { EventsService } from '@services/events.service'
import { SessionService } from '@services/sessions.service'
import { PaginationSchema } from '@utils/pagination'

export class EventsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/events',
            middlewares: [authMiddleware]
        })

        const service = di.resolve(EventsService)
        const controller = new EventsController(service)

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
                    body: insertEventsSchema.pick({ name: true })
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
                    body: insertEventsSchema.partial()
                })
            ]
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
    }
}