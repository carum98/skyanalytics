import { ResponsePaginationSchema } from '@utils/pagination'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// Database schema
export const sources = pgTable('sources', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
})

// Schemas
export const insertSourcesSchema = createInsertSchema(sources)
    .pick({ name: true })
    .required()

export const selectSourcesSchema = createSelectSchema(sources)
    .pick({ id: true, name: true })

export const paginateSourcesSchema = ResponsePaginationSchema(selectSourcesSchema)

// Types
export type InsertSourcesSchema = z.infer<typeof insertSourcesSchema>
export type SelectSourcesSchema = z.infer<typeof selectSourcesSchema>
export type PaginateSourcesSchema = z.infer<typeof paginateSourcesSchema>