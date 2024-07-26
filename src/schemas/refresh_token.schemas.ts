import { index, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { userAccounts } from './user_accounts.schemas'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const refreshToken = pgTable('refresh_token', {
    id: serial('id').primaryKey(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    user_account_id: integer('user_account_id').references(() => userAccounts.id).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().$onUpdate(() => new Date()),
    deleted_at: timestamp("deleted_at"),
}, (table) => ({
    user_account_id: index('refresh_token_user_account_id').on(table.user_account_id),
}))

// Schemas
export const insertRefreshTokenSchema = createInsertSchema(refreshToken)
    .pick({ token: true, user_account_id: true })

export const selectRefreshTokenSchema = createInsertSchema(refreshToken)
    .pick({ token: true, user_account_id: true })

// Types
export type InsertRefreshTokenSchema = z.infer<typeof insertRefreshTokenSchema>
export type SelectRefreshTokenSchema = z.infer<typeof selectRefreshTokenSchema>