import { Request, Response } from 'express'
import { SourcesService } from '@services/sources.service'
import { PaginationSchemaType } from '@utils/pagination'
import { MetricsFilter, StatsFilter } from '@schemas/_query'
import { InsertSourcesSchema } from '@schemas/sources.schemas'
import { ParamsCode } from '@schemas/_params'
import { HeadersTimeZone } from '@schemas/_headers'

export class SourcesController {
    constructor(private service: SourcesService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const query = req.query as unknown as PaginationSchemaType

        const sources = await this.service.getAll(query)
        
        res.json(sources)
    }

    get = async (req: Request, res: Response): Promise<void> => {
        const params = req.params as unknown as ParamsCode

        const source = await this.service.get(params.code)
        res.json(source)
    }

    create = async (req: Request, res: Response): Promise<void> => {
        const body = req.body as unknown as InsertSourcesSchema
        const file = req.file

        const source = await this.service.create(body, file)
        res.json(source)
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const body = req.body as unknown as InsertSourcesSchema
        const params = req.params as unknown as ParamsCode
        const file = req.file

        const source = await this.service.update(params.code, body, file)
        res.json(source)
    }

    delete = async (req: Request, res: Response): Promise<void> => {
        const params = req.params as unknown as ParamsCode

        const data = await this.service.delete(params.code)

        if (data) {
            res.status(204).json()
        }
    }

    getIcon = async (req: Request, res: Response): Promise<void> => {
        const params = req.params as unknown as ParamsCode
        const path = await this.service.getIconPath(params.code)

        if (!path) {
            res.status(404).json({ message: 'Icon not found' })
        } else {
            await new Promise((resolve, reject) => {
                res.sendFile(path, (err) => {
                    (err) ? reject(err) : resolve(null)
                })
            })
        }
    }

    getMetrics = async (req: Request, res: Response): Promise<void> => {
        const headers = req.headers as unknown as HeadersTimeZone
        const params = req.params as unknown as ParamsCode
        const query = req.query as unknown as StatsFilter

        const metrics = await this.service.getMetrics(params.code, {
            ...query,
            ...headers
        })

        res.json(metrics)
    }

    getStats = async (req: Request, res: Response): Promise<void> => {
        const headers = req.headers as unknown as HeadersTimeZone
        const params = req.params as unknown as ParamsCode
        const query = req.query as unknown as StatsFilter

        const stats = await this.service.getStats(params.code, {
            ...query,
            ...headers
        })

        res.json(stats)
    }

    getViews = async (req: Request, res: Response): Promise<void> => {
        const headers = req.headers as unknown as HeadersTimeZone
        const params = req.params as unknown as ParamsCode
        const query = req.query as unknown as MetricsFilter

        const views = await this.service.getViews(params.code, {
            ...query,
            ...headers
        })

        res.json(views)
    }
}