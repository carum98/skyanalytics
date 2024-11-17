import { navigations } from '@schemas/navigations.schemas'
import { sessions } from '@schemas/sessions.schemas'
import { sources } from '@schemas/sources.schemas'
import { groupByAndCountObject } from '@utils/group-and-count'
import { DateRange, rangeDates } from '@utils/range-dates'
import { between, eq } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'

export class SummaryRepository {
	constructor (public readonly db: NodePgDatabase) {}

	public async getData(dateRange: DateRange) {
		const range = rangeDates(dateRange)
		const start = new Date(range.start)
		const end = new Date(range.end)

        const data = await this.db.selectDistinct({
            id: sessions.id,
            os: sessions.os,
            country: sessions.country,
            software: sessions.software,
        })
        .from(sessions)
		.leftJoin(navigations, eq(sessions.id, navigations.session_id))
		.where(
			between(navigations.created_at, start, end)
		)

		const visitors = await this.db.selectDistinct({
			code: sources.code,
			name: sources.name,
			icon_path: sources.icon_path,
			session_id: sessions.id,
		})
		.from(sessions)
		.leftJoin(navigations, eq(sessions.id, navigations.session_id))
		.leftJoin(sources, eq(sessions.source_id, sources.id))
		.groupBy(sources.id, sessions.id)
		.where(
			between(navigations.created_at, start, end)
		)


		const parseData = (data: any[], path: string) => groupByAndCountObject(data, path).sort((a, b) => b.count - a.count).slice(0, 10)

        return {
            os: parseData(data, 'os'),
            country: parseData(data, 'country'),
            software: parseData(data, 'software'),
			visitors: visitorsParser(visitors),
			dates: {
				start: formatDate(start),
				end: formatDate(end),
			}
        }
	}
}

const formatDate = (date: Date) => {
	const month = date.toLocaleString('default', { month: 'long' })
	const day = date.getDate()
	const year = date.getFullYear()
	const hours = date.getHours()
	const minutes = date.getMinutes()

	return `${month} ${day}, ${year} ${hours}:${minutes}`
}

function visitorsParser(data: any[]) {
	return Object.entries(Object.groupBy(data, (v) => v?.code || '')).map(([_, value]) => ({
		name: value?.at(0)?.name || 'Unknown',
		icon_path: value?.at(0)?.icon_path,
		count: value?.length || 0
	})).sort((a, b) => b.count - a.count)
}