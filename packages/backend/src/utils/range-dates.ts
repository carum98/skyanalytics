export enum DateRange {
    last_30_minutes = 'last_30_minutes',
    last_hour = 'last_hour',
    last_12_hours = 'last_12_hours',
    last_24_hours = 'last_24_hours',
    last_7_days = 'last_7_days',
    last_15_days = 'last_15_days',
    last_30_days = 'last_30_days',
    this_week = 'this_week',
    this_month = 'this_month',
    last_month = 'last_month',
    last_2_months = 'last_2_months',
    last_3_months = 'last_3_months',
}

export function rangeDates(date_range: DateRange) {
    const end = new Date()
    const start = new Date()

    switch (date_range) {
        case DateRange.last_30_minutes:
            start.setMinutes(start.getMinutes() - 30)
            break
        case DateRange.last_hour:
            start.setHours(start.getHours() - 1)
            break
        case DateRange.last_12_hours:
            start.setHours(start.getHours() - 12)
            break
        case DateRange.last_24_hours:
            start.setHours(start.getHours() - 24)
            break
        case DateRange.last_7_days:
            start.setDate(start.getDate() - 7)
            break
        case DateRange.last_15_days:
            start.setDate(start.getDate() - 15)
            break
        case DateRange.last_30_days:
            start.setDate(start.getDate() - 30)
            break
        case DateRange.this_week:
            const dayOfWeek = start.getDay()
            const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek // Adjust for Sunday being day 0
            start.setDate(start.getDate() + diffToMonday)
            start.setHours(0, 0, 0, 0)
            break
        case DateRange.this_month:
            start.setDate(1)
            break
        case DateRange.last_month:
            start.setMonth(start.getMonth() - 1)
            start.setDate(1)
            end.setDate(0)
            break
        case DateRange.last_2_months:
            start.setMonth(start.getMonth() - 2)
            start.setDate(1)
            end.setDate(0)
            break
        case DateRange.last_3_months:
            start.setMonth(start.getMonth() - 3)
            start.setDate(1)
            end.setDate(0)
            break
        default:
            throw new Error('Invalid date range')
    }

    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}