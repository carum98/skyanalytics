import { Request, Response } from 'express'
import { EventsService } from '@services/events.service'
import { PaginationSchemaType } from '@utils/pagination'

export class EventsController {
    constructor(private service: EventsService) {}

    public getAll = async (req: Request, res: Response) => {
        const query = req.query as unknown as PaginationSchemaType
        
        const data = await this.service.getAll(query)

        res.json(data)
    }

    public create = async (req: Request, res: Response) => {
        const params = req.body

        const data = await this.service.create(params)

        res.json(data)
    }

    public get = async (req: Request, res: Response) => {
        const id = req.params.id

        const data = await this.service.get(parseInt(id))

        res.json(data)
    }

    public update = async (req: Request, res: Response) => {
        const id = req.params.id
        const params = req.body

        const data = await this.service.update(parseInt(id), params)

        res.json(data)
    }

    public delete = async (req: Request, res: Response) => {
        const id = req.params.id

        const data = await this.service.delete(parseInt(id))

        res.json(data)
    }
}