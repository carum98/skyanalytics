import { AuthController } from '@controllers/auth.controller'
import { DepencyInjection } from '@core/di.core'
import { RouterCore } from '@core/router.core'
import { authMiddleware, refreshMiddleware } from '@middlewares/auth.middleware'
import { requestMiddleware } from '@middlewares/request.middleware'
import { loginBodySchema, refreshTokenBodySchema } from '@schemas/_request'
import { sessionPayload } from '@schemas/_session'
import { AuthService } from '@services/auth.service'
import { SummaryService } from '@services/summary.service'

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

		this.get({
			name: '/me',
			handler: authController.me,
			middlewares: [
				authMiddleware,
				requestMiddleware({
					body: sessionPayload,
				})
			]
		})

        this.post({
            name: '/send-email',
            handler: async (_, res) => {
                const service = di.resolve(SummaryService)

                const response = await service.sendEmail()
                res.send(response)
            },
        })
    }
}
