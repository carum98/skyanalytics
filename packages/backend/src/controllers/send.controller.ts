import { Request, Response } from 'express'
import { EventsService } from '@services/events.service'
import { SendBodySchema } from '@schemas/_request'
import { NavigationsService } from '@services/navigations.service'

export class SendController {
    constructor(
        private eventsService: EventsService,
        private navigationService: NavigationsService
    ) {}

    public create = async (req: Request, res: Response) => {
        const body = req.body as SendBodySchema
        const session_id = (req as any).session_id as number

        // Global metadata
        if (!body.event && !body.navigation && body.metadata) {
            req.session.metadata = body.metadata
        }

        if (body.event) {
            await this.eventsService.create({ 
                name: body.event,
                session_id
            })
        }

        if (body.navigation) {
            const metadata = {
                ...req.session.metadata,
                ...body.metadata
            }

            await this.navigationService.create({
                name: body.navigation,
                session_id,
				metadata: Object.keys(metadata).length > 0 
                    ? metadata 
                    : undefined
            })
        }

		res.status(201).send()
    }
}