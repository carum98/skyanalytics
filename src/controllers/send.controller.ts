import { Request, Response } from 'express'
import { SelectEventsSchema } from '@schemas/events.schemas'
import { EventsService } from '@services/events.service'
import { SendBodySchema } from '@schemas/_request'
import { NavigationsService } from '@services/navigations.service'
import { SelectNavigationsSchema } from '@schemas/navigations.schemas'

export class SendController {
    constructor(
        private eventsService: EventsService,
        private navigationService: NavigationsService
    ) {}

    public create = async (req: Request, res: Response) => {
        const body = req.body as SendBodySchema
        const session_id = (req as any).session_id as number

        let response: { event: SelectEventsSchema | null, navigation: SelectNavigationsSchema | null } = {
            event: null,
            navigation: null
        }

        if (body.event) {
            response.event = await this.eventsService.create({ 
                name: body.event,
                session_id
            })
        }

        if (body.navigation) {
            response.navigation = await this.navigationService.create({
                name: body.navigation,
                session_id
            })
        }

        res.json(response)
    }
}