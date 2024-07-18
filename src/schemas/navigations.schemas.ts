import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { sessions } from './sessions.schemas'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { ResponsePaginationSchema } from '@utils/pagination'

export const navigations = pgTable('navigations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    session_id: integer('session_id').references(() => sessions.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    parent_id: index('navigation_session_id').on(table.session_id),
}))

// Schemas
export const insertNavigationsSchema = createInsertSchema(navigations)
    .pick({ name: true, session_id: true })
    .required()

export const selectNavigationsSchema = createSelectSchema(navigations)
    .pick({ id: true, name: true })

export const paginatedNavigationsSchema = ResponsePaginationSchema(selectNavigationsSchema)

// Types
export type InsertNavigationsSchema = z.infer<typeof insertNavigationsSchema>
export type SelectNavigationsSchema = z.infer<typeof selectNavigationsSchema>
export type PaginatedNavigationsSchema = z.infer<typeof paginatedNavigationsSchema>