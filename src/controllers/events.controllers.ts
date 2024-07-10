import { Request, Response } from 'express'
import { EventsService } from '@services/events.service'

export class EventsController {
    constructor(private service: EventsService) {}

    public getAll = async (req: Request, res: Response): Promise<void> => {
        const data = await this.service.getAll()

        res.json(data)
    }

    public create = async (req: Request, res: Response): Promise<void> => {
        const params = req.body

        const data = await this.service.create(params)

        res.json(data)
    }
}