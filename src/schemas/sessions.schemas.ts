import { z } from 'zod'
import { index, integer, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { sources } from '@schemas/sources.schemas'
import { systemOperative } from '@utils/origin-detect'

export const osEnum = pgEnum('os', systemOperative)

// Database Schema
export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    uuid: varchar('uuid', { length: 100 }).notNull().unique(),
    os: osEnum('os'),
    software: varchar('software', { length: 100 }),
    country: varchar('country', { length: 100 }),
    city: varchar('city', { length: 100 }),
    lat: varchar('lat', { length: 100 }),
    lon: varchar('lon', { length: 100 }),
    ip: varchar('ip', { length: 100 }),
    source_id: integer('source_id').references(() => sources.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    source_id: index('sessions_source_id').on(table.source_id),
}))

// Schemas
export const insertSessionsSchema = createInsertSchema(sessions)
    .omit({ id: true, created_at: true })
    .required()

export const selectSessionsSchema = createInsertSchema(sessions)

// Types
export type InsertSessionsSchema = z.infer<typeof insertSessionsSchema>
export type SelectSessionsSchema = z.infer<typeof selectSessionsSchema>