import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Database schema
export const sources = pgTable('sources', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
})

// Schemas
export const insertSourcesSchema = createInsertSchema(sources)
    .omit({ id: true, createdAt: true, updatedAt: true })
    .required()


export const selectSourcesSchema = createSelectSchema(sources)

// Types
export type InsertSourcesSchema = z.infer<typeof insertSourcesSchema>
export type SelectSourcesSchema = z.infer<typeof selectSourcesSchema>