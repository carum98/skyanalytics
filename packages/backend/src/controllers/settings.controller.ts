import { Request, Response } from 'express'
import { SettingsRepository } from '@repositories/settings.repository'
import { ParamsSettingsKey } from '@schemas/_params'

export class SettingsController {
	constructor(private repository: SettingsRepository) {}

	get = async (req: Request, res: Response): Promise<void> => {
		const { key } = req.params as ParamsSettingsKey

		const data = await this.repository.get(key)
		res.json(data)
	}

	update = async (req: Request, res: Response): Promise<void> => {
		const { key } = req.params as ParamsSettingsKey
		const { payload, ...rest } = req.body as Record<string, any>

		const data = await this.repository.updateSettings(key, rest)

		res.json(data)
	}
}