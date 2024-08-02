import { DateRange } from './range-dates'

export function groupByRangeDates(data: Array<{ created_at: Date }>, date_range: DateRange, filters: { start: string, end: string }) {
    const groupByDay = Object.groupBy(data, (item) => {
        return trimDate(item.created_at.toISOString(), date_range)
    })

    const dataEntries = Object.entries(groupByDay).map(([date, items]) => {
        return [date, items?.length || 0]
    })

    // Fill days without data with 0
    const start = new Date(filters.start)
    const end = new Date(filters.end)

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const key = trimDate(date.toISOString(), date_range)

        if (!groupByDay[key]) {
            dataEntries.push([key, 0])
        }
    }

    dataEntries.sort((a, b) => {
        return new Date(a[0]).getTime() - new Date(b[0]).getTime()
    })

    return Object.fromEntries(dataEntries)
}

function trimDate(date: string, date_range: DateRange) {
    if (date_range.includes('month')) {
        return new Date(date).toISOString().split('T')[0].slice(0, 7)
    }

    return new Date(date).toISOString().split('T')[0]
}