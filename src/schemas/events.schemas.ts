import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Database schema
export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 })
})

// Schemas
export const insertEventsSchema = createInsertSchema(events)
    .omit({ id: true })
    .required()

export const selectEventsSchema = createSelectSchema(events)

// Types
export type InsertEventsSchema = z.infer<typeof insertEventsSchema>
export type SelectEventsSchema = z.infer<typeof selectEventsSchema>