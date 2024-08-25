import { z } from 'zod'
import { index, integer, json, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { sources } from '@schemas/sources.schemas'
import { systemOperative } from '@utils/origin-detect'
import { ResponsePaginationSchema } from '@utils/pagination'

export const osEnum = pgEnum('os', systemOperative)

// Database Schema
export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    uuid: varchar('uuid', { length: 100 }).notNull().unique(),
    os: osEnum('os'),
    software: varchar('software', { length: 100 }),
    country: varchar('country', { length: 100 }),
    ip: varchar('ip', { length: 100 }),
    location: json('location').$type<{ latitude: number, longitude: number, city: string | null }>(),
    source_id: integer('source_id').references(() => sources.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    source_id: index('sessions_source_id').on(table.source_id),
}))

// Schemas
export const insertSessionsSchema = createInsertSchema(sessions)
    .omit({ id: true, created_at: true })
    .extend({
        location: z.object({
            latitude: z.number(),
            longitude: z.number(),
            city: z.string().nullable(),
        }).nullable(),
    })
    .required()

export const selectSessionsSchema = createSelectSchema(sessions)
    .pick({ country: true, os: true, software: true })

export const paginateSessionsSchema = ResponsePaginationSchema(selectSessionsSchema)

// Types
export type InsertSessionsSchema = z.infer<typeof insertSessionsSchema>
export type SelectSessionsSchema = z.infer<typeof selectSessionsSchema>