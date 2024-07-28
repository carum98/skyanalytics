import { Request, Response } from 'express'
import { EventsService } from '@services/events.service'
import { PaginationSchemaType } from '@utils/pagination'
import { InsertEventsSchema } from '@schemas/events.schemas'

export class EventsController {
    constructor(private service: EventsService) {}

    public getAll = async (req: Request, res: Response) => {
        const query = req.query as unknown as PaginationSchemaType
        
        const data = await this.service.getAll(query)

        res.json(data)
    }

    public create = async (req: Request, res: Response) => {
        const session_id = (req as any).session_id

        const params = { 
            ...req.body,
            session_id
         } as InsertEventsSchema

        const event = await this.service.create(params)

        res.json({ event })
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
        const data = await this.service.delete(parseInt(req.params.id))

        if (data) {
            res.status(204).json()
        }
    }
}