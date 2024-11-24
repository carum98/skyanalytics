import { index, integer, pgTable, serial, timestamp, varchar, json } from 'drizzle-orm/pg-core'
import { selectSessionsSchema, sessions } from './sessions.schemas'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@utils/pagination'

export const views = pgTable('navigations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    session_id: integer('session_id').references(() => sessions.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
	metadata: json('metadata'),
}, (table) => ({
    parent_id: index('navigation_session_id').on(table.session_id),
}))

// Schemas
export const insertViewsSchema = createInsertSchema(views)
    .pick({ name: true, session_id: true })
    .required()
	.extend({
		metadata: z.record(z.string()).optional()
	})

export const selectViewsSchema = createSelectSchema(views)
    .pick({ id: true, name: true, metadata: true, created_at: true })
    .extend({
        session: selectSessionsSchema.pick({ os: true, software: true, country: true })
    })

export const paginatedViewsSchema = ResponsePaginationSchema(selectViewsSchema)

// Types
export type InsertViewsSchema = z.infer<typeof insertViewsSchema>
export type SelectViewsSchema = z.infer<typeof selectViewsSchema>
export type PaginatedViewsSchema = z.infer<typeof paginatedViewsSchema>