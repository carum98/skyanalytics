import { SQL, sql } from 'drizzle-orm'

/**
 * { user: { code: { equal: "12345" } } }
 * { role: { equal: "admin" } }
 */
export type Filter = Record<string, Record<string, string | object>>

const conditions = {
    equal: '=',
    like: 'LIKE',
    not_equal: '!=',
    is_null: 'IS NULL',
    is_not_null: 'IS NOT NULL',
    in: 'IN',
    not_in: 'NOT IN'
} as const as Record<string, string>

export function queryFiltersSQL (filters?: Filter): SQL[] {
    const sqlChunks: SQL[] = []

    if (filters !== undefined) {
        sqlChunks.push(...parseFilter(filters))
    }

    return sqlChunks
}

function parseFilter (filters: Filter): SQL[] {
    const sqlChunks: SQL[] = []

    for (const [table, value] of Object.entries(filters)) {
        // Prevent parsing filters that are not objects (not conditions)
        if (typeof value === 'string' || value === undefined) {
            continue
        }

        for (const [key, data] of Object.entries(value)) {
            const { table_column, condition_symbol, rawData } = parseData(table, key, data)

            const queryChunks = [
                sql.raw(table_column),
                sql.raw(condition_symbol)
            ]

            if (![conditions.is_null, conditions.is_not_null].includes(condition_symbol)) {
                const queryChunk = parseValue(condition_symbol, rawData)
                queryChunks.push(queryChunk)
            }

            sqlChunks.push(sql.join(queryChunks, sql.raw(' ')))
        }
    }

    return sqlChunks
}

function parseData (table: string, key: string, data: string | object): { table_column: string, condition_symbol: string, rawData: string } {
    if (typeof data === 'string') {
        return {
            table_column: table,
            condition_symbol: conditions[key],
            rawData: data
        }
    } else {
        const [condition, rawData] = Object.entries(data)[0] as [string, string]

        const isJsonCondition = condition.includes('json_')

        const table_column = isJsonCondition ? `${table}->>'${key}'` : `${table}.${key}`
        const condition_symbol = conditions[condition.replace('json_', '')]

        return {
            table_column,
            condition_symbol,
            rawData
        }
    }
}

function parseValue (condition: string, data: string): SQL {
    if ([conditions.in, conditions.not_in].includes(condition)) {
        const values = data.split(',').map((value) => sql`${value}`)
        return sql`(${sql.join(values, sql.raw(','))})`
    } else {
        return sql`${data}`
    }
}