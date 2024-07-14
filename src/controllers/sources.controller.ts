import { Request, Response } from 'express'
import { SourcesService } from '@services/sources.service'
import { PaginationSchemaType } from '@utils/pagination'

export class SourcesController {
    constructor(private service: SourcesService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const query = req.query as unknown as PaginationSchemaType

        const sources = await this.service.getAll(query)
        
        res.json(sources)
    }

    get = async (req: Request, res: Response): Promise<void> => {
        const source = await this.service.get(parseInt(req.params.id))
        res.json(source)
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const source = await this.service.create(req.body)
        res.json(source)
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const source = await this.service.update(parseInt(req.params.id), req.body)
        res.json(source)
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        await this.service.delete(parseInt(req.params.id))
        res.json({ message: 'Source deleted' })
    }
}