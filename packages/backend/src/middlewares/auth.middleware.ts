import { UnauthorizedError } from '@utils/errors'
import { verifyRefreshToken, verifyToken } from '@utils/jwt'
import { NextFunction, Request, Response } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'
import { ZodError } from 'zod'

export function authMiddleware (req: Request, _res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ').at(-1)

    if (!token) {
        throw new UnauthorizedError('Token not provided')
    }

    try {
        const payload = verifyToken(token)

		req.body = {
			...req.body,
			payload,
		}

        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedError('Token expired')
        }

        if (error instanceof ZodError) {
            throw new UnauthorizedError('Invalid token payload')
        }

        throw new UnauthorizedError('Invalid token')
    }
}

export function refreshMiddleware (req: Request, _res: Response, next: NextFunction): void {
    const { refresh_token } = req.body as { refresh_token: string }

    try {
        verifyRefreshToken(refresh_token)

        next()
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new UnauthorizedError('Refresh token expired')
        }

        throw new UnauthorizedError('Invalid refresh token')
    }
}