import { ResponsePaginationSchema } from '@utils/pagination'
import { index, pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

const roles = ['admin', 'guest'] as const

export const roleEnum = pgEnum('role', roles)

export const userAccounts = pgTable('user_accounts', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 6 }).notNull().unique(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
	role: roleEnum('role').notNull().default(roles[1]),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    email: index('user_accounts_email').on(table.email),
}))

// Schemas
export const insertUserAccountsSchema = createInsertSchema(userAccounts)
    .pick({ name: true, email: true, password: true, role: true })
    .required()

export const selectUserAccountsSchema = createInsertSchema(userAccounts)
    .pick({ code: true, name: true, email: true, role: true })

export const paginateUserAccountsSchema = ResponsePaginationSchema(selectUserAccountsSchema)

// Types
export type InsertUserAccountsSchema = z.infer<typeof insertUserAccountsSchema>
export type SelectUserAccountsSchema = z.infer<typeof selectUserAccountsSchema>
export type PaginateUserAccountsSchema = z.infer<typeof paginateUserAccountsSchema>