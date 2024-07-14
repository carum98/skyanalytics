import { NextFunction, Request, Response } from 'express'
import { DatabaseError, HttpError } from '@utils/errors'
import { ZodError } from 'zod'

export function errorMiddleware (err: Error, _req: Request, res: Response, next: NextFunction): void {
    console.log(err)
    if (err instanceof ZodError) {
        res.status(500).json({ message: 'Internal typed error' })
    } else if (err instanceof HttpError) {
        res.status(err.status).json({ message: err.message })
    } else if (err instanceof DatabaseError) {
        res.status(err.status).json({ message: err.message })
    } else {
        res.status(500).json({ message: 'Internal server error' })
    }
}