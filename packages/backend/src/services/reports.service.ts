import { S3Storage } from '@core/storage.core'
import { readFile, removeFile } from '@middlewares/multer.middleware'
import { ReportsRepository } from '@repositories/reports.repository'
import { SettingsRepository } from '@repositories/settings.repository'
import { SourcesRepository } from '@repositories/sources.repository'
import { HeadersTimeZone } from '@schemas/_headers'
import { FilterSessions } from '@schemas/_query'
import { InsertReportsSchema, SelectReportsSchema, UpdateReportsSchema } from '@schemas/reports.schemas'
import { sendEmail } from '@utils/emails'
import { PaginationSchemaType } from '@utils/pagination'
import { rangeDates } from '@utils/range-dates'
import { parseToTimeZone, parseToUTC } from '@utils/time-zones'
import AdmZip from 'adm-zip'
import { Readable } from 'stream'

export class ReportsService {
	private readonly _storage: S3Storage;

	constructor(
		private reportsRepository: ReportsRepository,
		private settingsRepository: SettingsRepository,
		private sourceRepository: SourcesRepository,
	) {
		this._storage = new S3Storage('reports')
	}

	async getAll(query: PaginationSchemaType & FilterSessions & HeadersTimeZone) {
		const timeZone = query['x-timezone'] || 'UTC-0'

        if (query.start && query.end) {
            query.start = parseToUTC(query.start, timeZone)
            query.end = parseToUTC(query.end, timeZone)
        }

        if (query.date_range && !query.start && !query.end) {
            const { start, end } = rangeDates(query.date_range)

            query.start = start
            query.end = end
        } 

		const response = await this.reportsRepository.getAll(query)
		if (timeZone === undefined) return response

		const { data, pagination } = response
		return {
			data: data.map(({ created_at, ...rest }) => ({
				...rest,
				created_at: parseToTimeZone(created_at, timeZone),
			})),
			pagination,
		}
	}

	async get(code: string) {
		return this.reportsRepository.get(code)
	}

	async create(params: InsertReportsSchema, files?: Express.Multer.File[]) {
		const report = await this.reportsRepository.create(params)

		if (files) {
			await Promise.all(files.map((file) => this.uploadFiles(report.code, file)))
		}

		return report
	}

	async update(code: string, params: UpdateReportsSchema) {
		return this.reportsRepository.update(code, params)
	}

	async delete(code: string) {
		return this.reportsRepository.delete(code)
	}

	async sendEmail(report: SelectReportsSchema, onlyHtml?: boolean) {
		const config = await this.settingsRepository.getBugReportEmail()

		if (!config.enabled) {
			return { message: 'Emails are disabled' }
		}

		const icon_path = await this.sourceRepository.getIconPath(report.source.code)

		return sendEmail({
			to: config.users,
			subject: `SkyAnalytics -- Bug Report #${report.code}`,
			template: 'bug-report',
			data: {
				report: {
					...report,
					icon_path,
					created_at: formatDate(report.created_at, 'America/Costa_Rica')
				}
			},
			onlyHtml
		})
	}

	async getFiles(code: string) {
		const data = await this._storage.list(code)

		return data.Contents?.map((file) => {
			const filename = file.Key?.split('/').pop() || ''

			return {
				name: filename,
				size: file.Size,
				type: fileType(filename),
			}
		})
	}

	async getFile(code: string, key: string) {
		const data = await this._storage.get(`${code}/${key}`)

		return {
			buffer: data.Body,
			mimetype: data.ContentType,
		}
	}

	async getLogs(code: string): Promise<{} | undefined> {
		const data = await this._storage.get(`${code}/logs.zip`)
		if (!data.Body) return

		const buffer = await streamToBuffer(data.Body as Readable)

		// Unzip the buffer
		const zip = new AdmZip(buffer)
		const zipEntries = zip.getEntries()

		return processLogs(zipEntries)
	}

	private async uploadFiles(code: string, file: Express.Multer.File) {
		const buffer = await readFile(file)
		await this._storage.upload(`${code}/${file.originalname}`, buffer, file.mimetype)
		await removeFile(file)
	}
}

function formatDate(date: Date, timeZone: string) {
	const value = parseToTimeZone(date, timeZone)

    return new Date(value).toLocaleString('en-US', {
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
		year: 'numeric',
		weekday: 'long',
        hour12: true
    })
}

function fileType(key: string): string {
	const extension = key.split('.').pop()?.toLowerCase();
	switch (extension) {
	  case 'jpg':
	  case 'jpeg':
	  case 'png':
		return 'image';
	  case 'txt':
	  case 'log':
		return 'text';
	  default:
		return 'file';
	}
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function processLogs(logs: AdmZip.IZipEntry[]) {
	const folders = Object.groupBy(logs, (log) => log.entryName.split('/')?.at(1) || 'root')

	return Object.fromEntries(Object.entries(folders).map(([folder, logs]) => {
		const data = Object.entries(logs!).map(([key, log]) => {
			const buffer = log.getData()
			const content = buffer.toString('utf8')

			return {
				date: log.name.split('.').at(0),
				logs: logsContent(content),
			}
		})

		return [
			folder,
			data
		]
	}))
}

/**
 * @example
 * ```string
 * [2025-02-23T02:47:15.670210Z] [error] [tracker] Error while the tracker service is running - DataSyncServiceStatus.error\n\nauthorized\"\n}\n\n
 * ```
 * ```json
 * [
 * 	{
 * 		"time": "02:47:15.670210Z",
 * 		"message": "Error while the tracker service is running - DataSyncServiceStatus.error\n\nauthorized\"\n}",
 * 		"type": "error"
 * 	}
 * ]
 * ```
 */
function logsContent(content: String) {
	const logs = content.split('\n\n[')

	return logs.map((log) => {
		const [date, type] = log.replaceAll('[', '').replaceAll(']', '').split(' ')

		return {
			time: date.split('T').at(1)?.replace('Z', ''),
			message: log.slice(log.lastIndexOf(']') + 2, log.length).trim(),
			type: type,
		}
	})
}