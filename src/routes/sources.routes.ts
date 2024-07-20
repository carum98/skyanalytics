import { SourcesController } from '@controllers/sources.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { metricsFilter, statsFilter } from '@schemas/_query'
import { SourcesService } from '@services/sources.service'
import { PaginationSchema } from '@utils/pagination'
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
                    body: insertSourcesSchema
                })
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
                    body: insertSourcesSchema.partial()
                })
            ]
        })

        this.delete({
            name: '/:id',
            handler: controller.delete
        })
        
        this.get({
            name: '/:id/metrics',
            handler: controller.getMetrics,
            middlewares: [
                requestMiddleware({
                    query: metricsFilter
                })
            ]
        })

        this.get({
            name: '/:id/stats',
            handler: controller.getStats,
            middlewares: [
                requestMiddleware({
                    query: statsFilter
                })
            ]
        })
    }
}