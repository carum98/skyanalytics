import { SourcesController } from '@controllers/sources.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { paramsCode } from '@schemas/_params'
import { dateFilter, metricsFilter, statsFilter } from '@schemas/_query'
import { SourcesService } from '@services/sources.service'
import { PaginationSchema } from '@utils/pagination'
import { insertSourcesSchema } from 'src/schemas/sources.schemas'

export class SourcesRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/sources',
            middlewares: [authMiddleware]
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
            name: '/:code',
            handler: controller.get,
            middlewares: [
                requestMiddleware({
                    params: paramsCode
                })
            ]
        })

        this.put({
            name: '/:code',
            handler: controller.update,
            middlewares: [
                requestMiddleware({
                    body: insertSourcesSchema.partial(),
                    params: paramsCode
                })
            ]
        })

        this.delete({
            name: '/:code',
            handler: controller.delete,
            middlewares: [
                requestMiddleware({
                    params: paramsCode
                })
            ]
        })
        
        this.get({
            name: '/:code/metrics',
            handler: controller.getMetrics,
            middlewares: [
                requestMiddleware({
                    query: metricsFilter,
                    params: paramsCode
                })
            ]
        })

        this.get({
            name: '/:code/stats',
            handler: controller.getStats,
            middlewares: [
                requestMiddleware({
                    query: statsFilter.partial(),
                    params: paramsCode
                })
            ]
        })

        this.get({
            name: '/:code/views',
            handler: controller.getViews,
            middlewares: [
                requestMiddleware({
                    query: dateFilter,
                    params: paramsCode
                })
            ]
        })
    }
}