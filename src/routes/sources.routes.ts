import { SourcesController } from '@controllers/sources.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { SourcesService } from '@services/sources.service'
import { insertSourcesSchema } from 'src/schemas/sources.schemas'

export class SourcesRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/sources',
        })

        const service = di.resolve(SourcesService)
        const controller = new SourcesController(service)

        this.get({
            name: '/',
            handler: controller.getAll
        })

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                requestMiddleware({
                    body: insertSourcesSchema
                })
            ]
        })

        this.put({
            name: '/:id',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    body: insertSourcesSchema.partial()
                })
            ]
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
    }
}