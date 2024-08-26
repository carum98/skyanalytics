import { Request, Response } from 'express'
import { SessionService } from '@services/sessions.service'
import { PaginationSchemaType } from '@utils/pagination'
import { FilterSessions } from '@schemas/_query'
import { HeadersTimeZone } from '@schemas/_headers'

export class SessionsController {
    constructor(private service: SessionService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const headers = req.headers as unknown as HeadersTimeZone
        const query = req.query as unknown as PaginationSchemaType & FilterSessions

        const sources = await this.service.getAll({
            ...query,
            "x-timezone": headers['x-timezone']
        })
        
        res.json(sources)
    }
}