import { index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core'
import { sources } from './sources.schemas'

export const sessions = pgTable('sessions', {
    id: serial('id').primaryKey(),
    source_id: integer('source_id').references(() => sources.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
    source_id: index('source_id').on(table.source_id),
}))