import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { selectSourcesSchema, sources } from './sources.schemas'
import { ResponsePaginationSchema } from '@utils/pagination'

// Database schema
export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    source_id: integer('source_id').references(() => sources.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    source_id: index('source_id').on(table.source_id),
}))

// Schemas
export const insertEventsSchema = createInsertSchema(events)
    .pick({ name: true, source_id: true })
    .required()

export const selectEventsSchema = createSelectSchema(events)
    .pick({ id: true, name: true })
    .extend({
        source: selectSourcesSchema
    })

export const paginatedEventsSchema = ResponsePaginationSchema(selectEventsSchema)

// Types
export type InsertEventsSchema = z.infer<typeof insertEventsSchema>
export type SelectEventsSchema = z.infer<typeof selectEventsSchema>
export type PaginatedEventsSchema = z.infer<typeof paginatedEventsSchema>