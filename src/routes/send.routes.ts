import { EventsController } from '@controllers/events.controllers'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { sessionMiddleware } from '@middlewares/session.middleware'
import { EventsService } from '@services/events.service'
import { insertEventsSchema } from '@schemas/events.schemas'
import { Database } from '@core/database.core'

export class SendRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/send',
            middlewares: [sessionMiddleware(di.resolve(Database).db)]
        })

        const service = di.resolve(EventsService)
        const controller = new EventsController(service)

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                // requestMiddleware({
                //     body: insertEventsSchema
                // })
            ]
        })
    }
}