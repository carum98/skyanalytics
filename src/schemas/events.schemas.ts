import { mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core'

export const events = mysqlTable('events', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 })
})