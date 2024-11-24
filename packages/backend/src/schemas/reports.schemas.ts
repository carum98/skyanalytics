import { z } from 'zod'
import { index, integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { selectSessionsSchema, sessions } from './sessions.schemas'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { ResponsePaginationSchema } from '@utils/pagination'
import { parseIconPath, sources } from './sources.schemas'

const status = ['open', 'closed'] as const

export const statusEnum = pgEnum('status', status)

// Database schema
export const reports = pgTable('reports', {
	id: serial('id').primaryKey(),
	code: varchar('code', { length: 6 }).notNull().unique(),
	description: varchar('description', { length: 700 }),
	session_id: integer('session_id').references(() => sessions.id),
	status: statusEnum('status').notNull().default(status[0]),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
	deleted_at: timestamp("deleted_at"),
}, (table) => ({
	code: uniqueIndex('reports_code').on(table.code),
	session_id: index('reports_session_id').on(table.session_id),
}))

// Schemas
export const insertReportsSchema = createInsertSchema(reports)
	.pick({ description: true, session_id: true })
	.required()

export const updateReportsSchema = createInsertSchema(reports)
	.pick({ description: true, status: true })
	.partial()

export const selectReportsSchema = createSelectSchema(reports)
	.pick({ code: true, description: true, status: true, created_at: true })
	.extend({
        session: selectSessionsSchema.pick({ os: true, software: true, country: true }),
		source: createSelectSchema(sources).pick({ code: true, name: true, icon_path: true }).transform(parseIconPath)
    })

export const paginatedReportsSchema = ResponsePaginationSchema(selectReportsSchema)

// Types
export type InsertReportsSchema = z.infer<typeof insertReportsSchema>
export type UpdateReportsSchema = z.infer<typeof updateReportsSchema>
export type SelectReportsSchema = z.infer<typeof selectReportsSchema>
export type PaginatedReportsSchema = z.infer<typeof paginatedReportsSchema>