import { DateRange } from './range-dates'
import { parseToTimeZone } from './time-zones'

export function groupByRangeDates(
    data: Array<{ created_at: Date, session_id: number | null }>, 
    date_range: DateRange, 
    filters: { start: string, end: string },
    timezone: string
) {
    const groupByDay = Object.groupBy(data, (item) => {
        return trimDate(parseToTimeZone(item.created_at, timezone), date_range)
    })

    const dataEntries = Object.entries(groupByDay)
        .map(([date, items]) => ([
            date, 
            {
                views : items?.length || 0,
                sessions: new Set(data.map(item => item.session_id)).size
            }
        ]))

    // Fill days without data with 0
    const start = new Date(parseToTimeZone(filters.start, timezone))
    const end = new Date(parseToTimeZone(filters.end, timezone))

    for (let date = start; date <= end; dateIncrement(date, date_range)) {
        const key = trimDate(date.toISOString(), date_range)

        if (!groupByDay[key]) {
            dataEntries.push([key, { views: 0, sessions: 0 }])
        }
    }

    dataEntries.sort((a, b) => {
        const aDate = new Date(completeDate(a[0] as string, date_range))
        const bDate = new Date(completeDate(b[0] as string, date_range))

        return aDate.getTime() - bDate.getTime()
    })

    return Object.fromEntries(dataEntries) as Record<string, { views: number, sessions: number }>
}

function trimDate(date: string, date_range: DateRange) {
    if (date_range.includes('month')) {
        return new Date(date).toISOString().split('T')[0].slice(0, 7)
    }

    if (date_range.includes('hours')) {
        return new Date(date).toISOString().slice(0, 13)
    }

    return new Date(date).toISOString().split('T')[0]
}

function completeDate(date: string, date_range: DateRange) {
    if (date_range.includes('month')) {
        return date + '-01'
    }

    if (date_range.includes('hours')) {
        return date + ':00:00'
    }

    return date + 'T00:00:00'
}

function dateIncrement(date: Date, date_range: DateRange) {
    if (date_range.includes('month')) {
        return date.setMonth(date.getMonth() + 1)
    }

    if (date_range.includes('hours')) {
        return date.setHours(date.getHours() + 1)
    }

    return date.setDate(date.getDate() + 1)
}