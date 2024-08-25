import { Request, Response } from 'express'
import { SessionService } from '@services/sessions.service'
import { PaginationSchemaType } from '@utils/pagination'

export class SessionsController {
    constructor(private service: SessionService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const query = req.query as unknown as PaginationSchemaType

        const sources = await this.service.getAll(query)
        
        res.json(sources)
    }
}