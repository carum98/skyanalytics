import { BadRequestError } from '@utils/errors'
import { Request, Response, NextFunction } from 'express'

export function sessionMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const { payload } = req.body;

    if (!payload) {
      throw new BadRequestError('Invalid payload.');
    }

    return next()
}