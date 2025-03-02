import { ResponsePaginationSchema } from '@utils/pagination'
import { pgTable, serial, timestamp, uniqueIndex, varchar, pgEnum } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const typeEnum = pgEnum('type', ['web', 'app'])

// Database schema
export const sources = pgTable('sources', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 6 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    key: varchar('key', { length: 36 }).notNull().unique(),
    domain: varchar('domain', { length: 100 }),
    icon_path: varchar('icon_path', { length: 100 }),
    type: typeEnum('type'),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    code: uniqueIndex('sources_code').on(table.code),
}))

// Schemas
export const insertSourcesSchema = createInsertSchema(sources)
    .pick({ name: true, domain: true, type: true })
    .required()
    .partial({ domain: true, type: true })

export const selectSourcesSchema = createSelectSchema(sources)
    .pick({ code: true, name: true, key: true, domain: true, icon_path: true, type: true })
    .transform(parseIconPath)

export const paginateSourcesSchema = ResponsePaginationSchema(selectSourcesSchema)

// Types
export type InsertSourcesSchema = z.infer<typeof insertSourcesSchema>
export type SelectSourcesSchema = z.infer<typeof selectSourcesSchema>
export type PaginateSourcesSchema = z.infer<typeof paginateSourcesSchema>

// Utils
export function parseIconPath(data: any) {
    return {
        ...data,
        icon_path: data.icon_path ? `/sources/${data.code}/icon` : null
    }
}