import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { ReportsService } from '@services/reports.service'
import { PaginationSchemaType } from '@utils/pagination'
import { Request, Response } from 'express'
import { Readable } from 'node:stream'

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
		const attachments = req.files as Express.Multer.File[]

		const report = await this.service.create(body, attachments)
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

	public getFiles = async (req: Request, res: Response) => {
		const { code } = req.params
		const files = await this.service.getFiles(code)

		if (files?.length) {
			res.json(files)
		} else {
			res.status(404).json({ message: 'No files found' })
		}
	}

	public getLogs = async (req: Request, res: Response) => {
		const { code } = req.params
		const logs = await this.service.getLogs(code)

		if (logs !== undefined) {
			res.json(logs)
		} else {
			res.status(404).json({ message: 'No logs found' })
		}
	}

	public getFile = async (req: Request, res: Response) => {
		const { code, key } = req.params

		const data = await this.service.getFile(code, key)

		res.setHeader('Content-Type', data.mimetype || 'application/octet-stream')
		res.setHeader('Cache-Control', 'public, max-age=3600')

		if (data.buffer instanceof Readable) {
			data.buffer.pipe(res)
		} else {
			res.status(500).json({ error: 'Formato de imagen no reconocido.' });
		}	
	}
}