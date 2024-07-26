import { AuthController } from '@controllers/auth.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { refreshMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { loginBodySchema, refreshTokenBodySchema } from '@schemas/_request'
import { AuthService } from '@services/auth.service'

export class BaseRouter extends RouterCore {
    constructor(di: DepencyInjection) {
        super({
            path: '/',
        })

        const authController = new AuthController(
            di.resolve(AuthService)
        )

        this.post({
            name: '/login',
            handler: authController.login,
            middlewares: [
                requestMiddleware({
                    body: loginBodySchema,
                })
            ]
        })

        this.post({
            name: '/refresh-token',
            handler: authController.refreshToken,
            middlewares: [
                requestMiddleware({
                    body: refreshTokenBodySchema,
                }),
                refreshMiddleware
            ]
        })
    }
}
