import { BadRequestError } from '@utils/errors'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Request, Response, NextFunction } from 'express'

export function sessionMiddleware(db: NodePgDatabase) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { payload } = req.body

        if (!payload) {
          throw new BadRequestError('Invalid payload.');
        }

        const { source_id } = payload
        const ip = req.ip 

        console.log({ source_id, ip })

        res.json({ message: 'Session created', source_id, ip })
        return
    
        next()
    }
}