import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 })
})