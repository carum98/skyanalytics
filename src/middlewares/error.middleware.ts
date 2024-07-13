import { NextFunction, Request, Response } from 'express'
import { HttpError } from '@utils/errors'
import { ZodError } from 'zod'

export function errorMiddleware (err: Error, _req: Request, res: Response, next: NextFunction): void {
    if (err instanceof ZodError) {
        res.status(500).json({ message: 'Internal typed error' })
    } else if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message })
    } else {
        console.log(typeof err)
        res.status(500).json({ message: 'Internal server error' })
    }
}