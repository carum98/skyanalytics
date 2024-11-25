import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { ReportsService } from '@services/reports.service'
import { PaginationSchemaType } from '@utils/pagination'
import { Request, Response } from 'express'

export class ReportsController {
	constructor(private service: ReportsService) {}

	public getAll = async (req: Request, res: Response) => {
		const headers = req.headers as unknown as HeadersTimeZone
		const query = req.query as unknown as PaginationSchemaType & FilterSessions

		const reports = await this.service.getAll({
            ...query,
            "x-timezone": headers['x-timezone']
        })

		res.json(reports)
	}

	public get = async (req: Request, res: Response) => {
		const { code } = req.params
		const report = await this.service.get(code)
		res.json(report)
	}

	public create = async (req: Request, res: Response) => {
		const { body } = req
		const report = await this.service.create(body)
		res.json(report)
	}

	public update = async (req: Request, res: Response) => {
		const { code } = req.params
		const { body } = req
		const report = await this.service.update(code, body)
		res.json(report)
	}

	public delete = async (req: Request, res: Response) => {
		const { code } = req.params

		const data = await this.service.delete(code)
		if (data) {
            res.status(204).json()
        }
	}

	public sendEmail = async (req: Request, res: Response) => {
		const { code } = req.params
		const report = await this.service.get(code)
		const response = await this.service.sendEmail(report, true)
		res.send(response)
	}
}