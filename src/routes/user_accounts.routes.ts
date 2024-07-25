import { UserAccountsController } from '@controllers/user_accounts.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { requestMiddleware } from '@middlewares/request.middleware'
import { paramsCode } from '@schemas/_params'
import { insertUserAccountsSchema } from '@schemas/user_accounts.schemas'
import { UserAccountsService } from '@services/user_accounts.service'
import { PaginationSchema } from '@utils/pagination'

export class UserAccountsRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/user-accounts',
        })

        const controller = new UserAccountsController(
            di.resolve(UserAccountsService)
        )

        this.get({
            name: '/',
            handler: controller.getAll,
            middlewares: [
                requestMiddleware({
                    query: PaginationSchema,
                })
            ]
        })

        this.post({
            name: '/',
            handler: controller.create,
            middlewares: [
                requestMiddleware({
                    body: insertUserAccountsSchema,
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
                    body: insertUserAccountsSchema.partial(),
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
    }
}