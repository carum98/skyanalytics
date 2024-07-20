import { Request, Response } from 'express'
import { SourcesService } from '@services/sources.service'
import { PaginationSchemaType } from '@utils/pagination'
import { MetricsFilter, StatsFilter } from '@schemas/_query'

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
        const data = await this.service.delete(parseInt(req.params.id))

        if (data) {
            res.status(204).json()
        }
    }

    getMetrics = async (req: Request, res: Response): Promise<void> => {
        const query = req.query as unknown as MetricsFilter

        const metrics = await this.service.getMetrics(parseInt(req.params.id), query)
        res.json(metrics)
    }

    getStats = async (req: Request, res: Response): Promise<void> => {
        const query = req.query as unknown as StatsFilter

        const stats = await this.service.getStats(parseInt(req.params.id), query)
        res.json(stats)
    }
}