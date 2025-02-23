import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { sessionMiddleware } from '@middlewares/session.middleware'
import { EventsService } from '@services/events.service'
import { SessionService } from '@services/sessions.service'
import { SendController } from '@controllers/send.controller'
import { sendBodySchema } from '@schemas/_request'
import { ViewsService } from '@services/views.service'
import { headersSourceSchema, headerXRealIPSchema } from '@schemas/_headers'
import { ReportsService } from '@services/reports.service'
import { multerArrayMiddleware } from '@middlewares/multer.middleware'

export class SendRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/send',
        })

        const controller = new SendController(
            di.resolve(EventsService),
            di.resolve(ViewsService),
            di.resolve(ReportsService)
        )

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                multerArrayMiddleware('files', 10),
                requestMiddleware({
                    headers: headerXRealIPSchema.merge(headersSourceSchema),
                    body: sendBodySchema,
                }),
                sessionMiddleware(di.resolve(SessionService))
            ]
        })
    }
}