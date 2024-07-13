import { PaginationSchemaType, ResponsePaginationSchemaType } from '@utils/pagination'
import { and, asc, desc, isNull, like, or, sql, SQL } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { getTableConfig, PgColumn, PgSelect, PgTable } from 'drizzle-orm/pg-core'
import { Filter, queryFiltersSQL } from './query-filters.core'
import { DatabaseError } from '@utils/errors'

interface RepositoryCoreParams {
    db: NodePgDatabase
    table: PgTable
    select: any
    search_columns?: PgColumn[]
}

interface PaginateParams {
    query: PaginationSchemaType
    where: Where
}

interface SelectorParams extends Partial<Omit<PaginationSchemaType, 'search'>> {
    where: Where
    offset?: number
    filters?: Filter
}

interface InsertParams<TInsert> {
    params: TInsert
}

interface InsertManyParams<TInsert> {
    params: TInsert[]
}

interface UpdateParams<TUpdate> {
    where: Where
    params: Partial<TUpdate>
}

type Where = SQL<unknown> | undefined

export abstract class RepositoryCore<TSelect, TInsert, TUpdate> {
    protected readonly db: NodePgDatabase
    protected readonly table: PgTable
    protected readonly columns: PgColumn[]
    protected readonly select: PgSelect
    protected readonly search_columns?: PgColumn[]
    protected readonly table_name: string
    protected readonly deleted_column: PgColumn

    constructor (data: RepositoryCoreParams) {
        this.db = data.db
        this.table = data.table
        this.select = data.select
        this.search_columns = data.search_columns

        const { columns, name } = getTableConfig(this.table)

        this.columns = columns

        const deleted_column = this.columns.find((column) => column.name === 'deleted_at')

        this.deleted_column = deleted_column as PgColumn 
        this.table_name = name
    }

    /**
     *  Get all data from the database paginated 
     */
    protected async getAllCore ({ query, where }: PaginateParams): Promise<ResponsePaginationSchemaType<TSelect>> {
        const { page, per_page, search, sort_by, sort_order, ...filters } = query

        // Calculate offset, based on page and per_page values to paginate data
        // Example: page = 1, per_page = 10, offset = 0, page = 2, per_page = 10, offset = 10
        const offset = (page - 1) * per_page

        // If search is defined, create a where clause to search the value in all search_columns
        // This will reasign the where variable with the new where clause 'AND' with the search clause
        if (search !== undefined && this.search_columns !== undefined) {
            where = and(
                where,
                or(...this.search_columns.map((column) => like(column, `%${search}%`)))
            )
        }

        const [data, total] = await Promise.all([
            await this.query({ where, per_page, offset, sort_by, sort_order, filters }),
            await this.count({ where, filters })
        ])

        return {
            data,
            pagination: {
                total,
                page,
                per_page,
                total_pages: Math.ceil(total / per_page)
            }
        }
    }

    /**
     * Get one data from the database based on the given [Where] clause 
     */
    protected async getOneCore ({ where }: { where: Where }): Promise<TSelect> {
        try {
            const data = await this.query({ where })

            if (data.length === 0) {
                throw DatabaseError.fromMessage('Not Found', 404)
            }

            return data.at(0) as TSelect
        } catch (error) {
            throw (error instanceof Error)
                ? new DatabaseError(error)
                : error   
        }
    }

    /**
     * Update the data from the database based on the given [UpdateParams] 
     */
    protected async updateCore ({ where, params }: UpdateParams<TUpdate>): Promise<TSelect> {
        try {
            const data = await this.db.update(this.table)
                .set(params)
                .where(and(where, isNull(this.deleted_column)))
                .returning()

            if (data.length === 0) {
                throw DatabaseError.fromMessage('Not Updated', 404)
            }

            return data.at(0) as TSelect
        } catch (error) {
            throw (error instanceof Error)
                ? new DatabaseError(error)
                : error
        }
    }

    /**
     * Insert into the database based on the given [InsertParams]
     */
    protected async insertCore ({ params }: InsertParams<TInsert>): Promise<TSelect> {
        try {
            const data = await this.db.insert(this.table)
                .values([params])
                .returning()

            if (data.length === 0) {
                throw DatabaseError.fromMessage('Not Created', 404)
            }
    
            return data.at(0) as TSelect
        } catch (error) {
            throw (error instanceof Error)
                ? new DatabaseError(error)
                : error
        }
    }

    protected async deleteCore (where: Where): Promise<TSelect> {
        try {
            const data = await this.db.update(this.table)
                .set({ deleted_at: sql`CURRENT_TIMESTAMP` })
                .where(and(where, isNull(this.deleted_column)))
                .returning()

            if (data.length === 0) {
                throw DatabaseError.fromMessage('Not Deleted', 404)
            }

            return data.at(0) as TSelect
        } catch (error) {
            throw (error instanceof Error)
                ? new DatabaseError(error)
                : error 
        }
    }

    /**
     * Get the data from the database based on the given [SelectorParams]
     */
    private async query (params: SelectorParams): Promise<TSelect[]> {
        const { where, offset, per_page, sort_by, sort_order, filters } = params

        // Build the database query.
        // Join all with AND clause, and add the deleted_at column to prevent fetching deleted data
        let query = this.select.where(this.joinSql([
            ...[where as SQL, isNull(this.deleted_column)],
            ...queryFiltersSQL(filters)
        ]))

        // Chain limit and offset to the query if they are defined
        if (per_page !== undefined) {
            query = query.limit(per_page)
        }
        if (offset !== undefined) {
            query = query.offset(offset)
        }

        // Chain order by to the query if sort_by and sort_order are defined
        if (sort_by !== undefined && sort_order !== undefined) {
            const column = this.columns.find((column) => column.name === sort_by) as PgColumn

            /// TODO: Temporarily disable sorting
            
            // if (sort_order === 'desc') {
            //     query = query.orderBy(desc(column))
            // }

            // if (sort_order === 'asc') {
            //     query = query.orderBy(asc(column))
            // }
        }

        // Execute the query and return the data
        const data = await query

        // Parse the data
        if (data.length !== 0) {
            // Get all keys that contains '__'.
            // If the key contains '__', it means that the key is a relation
            const keys = Object.keys(data.at(0) as object).filter((key) => key.includes('__'))

            if (keys.length > 0) {
                data.forEach((item: any) => keys.forEach((key) => this.parseObject(item, key)))
            }
        }

        // Clear limit and offset from query instance
        const config = (query as any).config

        delete config.limit
        delete config.offset
        delete config.where

        // Return the data
        return data as TSelect[]
    }

    /**
     * Count the data from the database based on the given [SelectorParams] 
     */
    protected async count (params: Pick<SelectorParams, 'where' | 'filters'>): Promise<number> {
        const { where, filters } = params

        // Build the database query.
        // Join all with AND clause, and add the deleted_at column to prevent fetching deleted data
        const toSQL = this.select.where(this.joinSql([
            ...[where as SQL, isNull(this.deleted_column)],
            ...queryFiltersSQL(filters)
        ])).toSQL()

        const fromIndex = toSQL.sql.lastIndexOf('from')
        const countQuery = 'select count(*) as count ' + toSQL.sql.substring(fromIndex)

        let counter = 0

        const replacedQuery = countQuery.replace(/\?/g, () => {
            const value = toSQL.params[counter]
            counter++

            return typeof value === 'string' ? `'${value}'` : value as string
        })

        const result = await this.db.execute(sql`${sql.raw(replacedQuery)}`)

        return parseInt(result.rows[0].count as string)
    }

    /**
     * Join the relation objects
     * For example if the key is 'user__todo', the function will will merge the 'todo' object into the 'user' object 
     * and delete the 'user__todo' key, so the final object will be { user: { ...user, todo: { ...todo } } }
     */
    private parseObject (item: any, key: string): void {
        const [group, property] = key.split('__')

        if (item[group] !== null) {
            item[group] = {
                ...item[group],
                [property]: item[key]
            }
        }

        delete item[key]
    }

    private joinSql (values: SQL[]): SQL {
        return sql`${sql.join(values.filter(Boolean), sql.raw(' AND '))}`
    }
}