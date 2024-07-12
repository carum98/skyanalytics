import { Request, Response } from 'express'
import { SourcesService } from '@services/sources.service'

export class SourcesController {
    constructor(private service: SourcesService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const sources = await this.service.getAll()
        res.json(sources)
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