import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@utils/pagination'
import { selectSessionsSchema, sessions } from './sessions.schemas'

// Database schema
export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    session_id: integer('session_id').references(() => sessions.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    session_id: index('events_session_id').on(table.session_id),
}))

// Schemas
export const insertEventsSchema = createInsertSchema(events)
    .pick({ name: true, session_id: true })
    .required()

export const selectEventsSchema = createSelectSchema(events)
    .pick({ id: true, name: true, created_at: true })
	.extend({
        session: selectSessionsSchema.pick({ os: true, software: true, country: true })
    })

export const paginatedEventsSchema = ResponsePaginationSchema(selectEventsSchema)

// Types
export type InsertEventsSchema = z.infer<typeof insertEventsSchema>
export type SelectEventsSchema = z.infer<typeof selectEventsSchema>
export type PaginatedEventsSchema = z.infer<typeof paginatedEventsSchema>