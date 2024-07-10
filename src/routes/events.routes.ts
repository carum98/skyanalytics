import { EventsController } from '@controllers/events.controllers'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { EventsService } from '@services/events.service'

export class EventsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/events'
        })

        const service = di.resolve(EventsService)
        const controller = new EventsController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create
        })
    }
}