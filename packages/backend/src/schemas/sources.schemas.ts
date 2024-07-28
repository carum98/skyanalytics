import { ResponsePaginationSchema } from '@utils/pagination'
import { index, pgTable, serial, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Database schema
export const sources = pgTable('sources', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 6 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    key: varchar('key', { length: 36 }).notNull().unique(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    code: uniqueIndex('sources_code').on(table.code),
}))

// Schemas
export const insertSourcesSchema = createInsertSchema(sources)
    .pick({ name: true })
    .required()

export const selectSourcesSchema = createSelectSchema(sources)
    .pick({ code: true, name: true, key: true })

export const paginateSourcesSchema = ResponsePaginationSchema(selectSourcesSchema)

// Types
export type InsertSourcesSchema = z.infer<typeof insertSourcesSchema>
export type SelectSourcesSchema = z.infer<typeof selectSourcesSchema>
export type PaginateSourcesSchema = z.infer<typeof paginateSourcesSchema>