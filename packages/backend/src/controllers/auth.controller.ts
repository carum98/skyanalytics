import { LoginBodySchema, RefreshTokenBodySchema } from '@schemas/_request'
import { SessionPayload } from '@schemas/_session'
import { AuthService } from '@services/auth.service'
import { Request, Response } from 'express'

export class AuthController {
    constructor(private service: AuthService) {}
    
    login = async (req: Request, res: Response): Promise<void> => {
        const body = req.body as LoginBodySchema

        const response = await this.service.login(body)
        res.json(response)
    }

    refreshToken = async (req: Request, res: Response): Promise<void> => {
        const params = req.body as RefreshTokenBodySchema

        const response = await this.service.refreshToken(params)
        res.json(response)
    }

	me = async (req: Request, res: Response): Promise<void> => {
		const params = req.body as SessionPayload

		const response = await this.service.me(params)
		res.json(response)
	}
}