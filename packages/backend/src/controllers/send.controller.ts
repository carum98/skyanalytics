import { Request, Response } from 'express'
import { EventsService } from '@services/events.service'
import { SendBodySchema } from '@schemas/_request'
import { ViewsService } from '@services/views.service'
import { ReportsService } from '@services/reports.service'

export class SendController {
    constructor(
        private eventsService: EventsService,
        private viewsService: ViewsService,
        private reportsService: ReportsService
    ) {}

    public create = async (req: Request, res: Response) => {
        const body = req.body as SendBodySchema
        const session_id = (req as any).session_id as number

        // Global metadata
        if (!body.event && !body.navigation && body.metadata) {
            req.session.metadata = body.metadata
        }

        // Merge metadata from session and request
        const metadata = {
            ...req.session.metadata,
            ...body.metadata
        }

        if (body.event) {
            await this.eventsService.create({ 
                name: body.event,
                session_id,
                metadata: Object.keys(metadata).length > 0 
                    ? metadata 
                    : undefined
            })
        }

        if (body.navigation) {
            await this.viewsService.create({
                name: body.navigation,
                session_id,
				metadata: Object.keys(metadata).length > 0 
                    ? metadata 
                    : undefined
            })
        }

        if (body.bug_report) {
            const files = req.files as Express.Multer.File[]

            const data = await this.reportsService.create({
                description: body.bug_report.description,
                user: body.bug_report.user,
                session_id,
                metadata: Object.keys(metadata).length > 0 
                    ? metadata 
                    : undefined
            }, files)

            this.reportsService.sendEmail(data)
        }

		res.status(201).send()
    }
}