import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sources } from './sources.schemas'

// Database schema
export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    sourceId: integer('source_id').references(() => sources.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
}, (table) => ({
    source_id: index('source_id').on(table.sourceId),
}))

// Schemas
export const insertEventsSchema = createInsertSchema(events)
    .omit({ id: true, createdAt: true, updatedAt: true })
    .required()

export const selectEventsSchema = createSelectSchema(events)

// Types
export type InsertEventsSchema = z.infer<typeof insertEventsSchema>
export type SelectEventsSchema = z.infer<typeof selectEventsSchema>