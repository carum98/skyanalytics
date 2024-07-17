import { numeric, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

// Database Schema
export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    country: varchar('country', { length: 100 }),
    city: varchar('city', { length: 100 }),
    lat: varchar('lat', { length: 100 }),
    lon: varchar('lon', { length: 100 }),
    ip: varchar('ip', { length: 100 }),
    created_at: timestamp("created_at").notNull().defaultNow(),
})

// Schemas
export const insertSessionsSchema = createInsertSchema(sessions)
    .pick({ country: true, city: true, lat: true, lon: true, ip: true })
    .required()

export const selectSessionsSchema = createInsertSchema(sessions)

// Types
export type InsertSessionsSchema = z.infer<typeof insertSessionsSchema>
export type SelectSessionsSchema = z.infer<typeof selectSessionsSchema>