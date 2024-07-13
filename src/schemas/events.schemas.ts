import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sources } from './sources.schemas'

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
    .pick({ name: true })
    .required()

export const selectEventsSchema = createSelectSchema(events)

// Types
export type InsertEventsSchema = z.infer<typeof insertEventsSchema>
export type SelectEventsSchema = z.infer<typeof selectEventsSchema>