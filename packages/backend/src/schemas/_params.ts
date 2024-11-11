import { z } from 'zod'
import { SettingsKeySchema } from './settings.schemas'

// Code
export const paramsCode = z.object({
    code: z.string().length(6)
})

export type ParamsCode = z.infer<typeof paramsCode>

// Settings Keys
export const paramsSettingsKey = z.object({
    key: SettingsKeySchema
})

export type ParamsSettingsKey = z.infer<typeof paramsSettingsKey>