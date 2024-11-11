import { DateRange } from '@utils/range-dates'
import { json, pgEnum, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const settingsKeys = ['email_summary'] as const

export const settingsKeysEnum = pgEnum('settings_keys', settingsKeys)
export const SettingsKeySchema = z.enum(settingsKeys)

// Database Schema
export const settings = pgTable('settings', {
	id: serial('id').primaryKey(),
	key: settingsKeysEnum('key').unique(),
	data: json('data').$type<Record<string, any>>(),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
	deleted_at: timestamp("deleted_at"),
})

// Schemas
export const insertSettingsSchema = createInsertSchema(settings)
	.pick({ key: true, data: true })
	.required()

export const selectSettingsSchema = createInsertSchema(settings)
	.pick({ key: true, data: true })

// Types
export type InsertSettingsSchema = z.infer<typeof insertSettingsSchema>
export type SelectSettingsSchema = z.infer<typeof selectSettingsSchema>
export type SettingsKey = z.infer<typeof SettingsKeySchema>

// Schemas settings
export const SummaryEmailSchema = z.object({
	enabled: z.boolean(),
	date_range: z.nativeEnum(DateRange),
	users: z.array(z.number())
}).default({
	enabled: false,
	date_range: DateRange.last_7_days,
	users: []
})
