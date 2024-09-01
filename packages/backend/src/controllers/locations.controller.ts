import { Request, Response } from 'express'
import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { LocationsService } from '@services/locations.service'

export class LocationsController {
    constructor(private service: LocationsService) {}

    getAll = async (req: Request, res: Response): Promise<void> => {
        const headers = req.headers as unknown as HeadersTimeZone
        const query = req.query as unknown as FilterSessions

        const sources = await this.service.getAll({
            ...query,
            "x-timezone": headers['x-timezone']
        })
        
        res.json(sources)
    }
}