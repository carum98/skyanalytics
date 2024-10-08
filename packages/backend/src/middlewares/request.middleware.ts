import { Request, Response, NextFunction } from 'express'
import { ZodError, AnyZodObject, ZodEffects } from 'zod'

interface IRequest {
    body?: AnyZodObject | ZodEffects<any>
    query?: AnyZodObject
    params?: AnyZodObject
    headers?: AnyZodObject
}

interface IError {
    errors: Array<{
        field: string
        message: string
    }>
}

export function requestMiddleware ({ headers, body, query, params }: IRequest) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (headers != null) req.headers = headers.passthrough().parse(req.headers)
            
            if (params != null) req.params = params.parse(req.params)
            if (body != null) req.body = body.parse(req.body)
            if (query != null) req.query = query.passthrough().parse(req.query)

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json(buildErrorMessage(error))
            } else {
                res.status(500).json({ message: 'Internal server error' })
            } 
        }
    }
}

function buildErrorMessage (error: ZodError): IError {
    const data: IError = {
        errors: []
    }

    error.errors.forEach((err) => {
        data.errors.push({
            field: err.path.join('.'),
            message: err.message
        })
    })

    return data
}