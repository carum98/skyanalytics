import { Request, Response } from 'express'
import { EventsService } from '@services/events.service'
import { PaginationSchemaType } from '@utils/pagination'
import { SessionData } from '@middlewares/session.middleware'
import { InsertEventsSchema } from '@schemas/events.schemas'
import { SessionService } from '@services/sessions.service'

export class EventsController {
    constructor(private service: EventsService, private serviceSession?: SessionService) {}

    public getAll = async (req: Request, res: Response) => {
        const query = req.query as unknown as PaginationSchemaType
        
        const data = await this.service.getAll(query)

        res.json(data)
    }

    public create = async (req: Request, res: Response) => {
        const params = req.body as InsertEventsSchema
        const sessionData = (req as any).session as SessionData

        const event = await this.service.create(params)
        const session = await this.serviceSession?.create({
            ip: sessionData.ip,
            city: sessionData.city,
            country: sessionData.country,
            lat: sessionData.lat,
            lon: sessionData.lon,
        })

        res.json({
            event,
            session
        })
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