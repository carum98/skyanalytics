export enum DateRange {
    last_24_hours = 'last_24_hours',
    last_7_days = 'last_7_days',
    last_30_days = 'last_30_days',
    this_week = 'this_week',
    this_month = 'this_month',
    last_month = 'last_month',
    last_2_months = 'last_2_months',
    last_3_months = 'last_3_months',
}

export function range24hours() {
    const end = new Date()
    const start = new Date()

    start.setHours(start.getHours() - 24)

    return { 
        start, 
        end 
    }
}

export function nextDate(start: Date, end: Date, date_range: DateRange) {
    switch (date_range) {
        case DateRange.last_24_hours:
            start.setHours(start.getHours() + 24)
            end.setHours(end.getHours() + 24)
            break
        case DateRange.last_7_days:
            start.setDate(start.getDate() + 7)
            end.setDate(end.getDate() + 7)
            break
        case DateRange.last_30_days:
            start.setDate(start.getDate() + 30)
            end.setDate(end.getDate() + 30)
            break
        case DateRange.this_week:
            start.setDate(start.getDate() + 7)
            end.setDate(end.getDate() + 7)
            break
        case DateRange.this_month:
        case DateRange.last_month:
            start.setMonth(start.getMonth() + 1)
            end.setMonth(end.getMonth() + 1)
            break
        case DateRange.last_2_months:
            start.setMonth(start.getMonth() + 2)
            end.setMonth(end.getMonth() + 2)
            break
        case DateRange.last_3_months:
            start.setMonth(start.getMonth() + 3)
            end.setMonth(end.getMonth() + 3)
            break
    }

    return { 
        start, 
        end 
    }
}

export function previousDate(start: Date, end: Date, date_range: DateRange) {
    switch (date_range) {
        case DateRange.last_24_hours:
            start.setHours(start.getHours() - 24)
            end.setHours(end.getHours() - 24)
            break
        case DateRange.last_7_days:
            start.setDate(start.getDate() - 7)
            end.setDate(end.getDate() - 7)
            break
        case DateRange.last_30_days:
            start.setDate(start.getDate() - 30)
            end.setDate(end.getDate() - 30)
            break
        case DateRange.this_week:
            start.setDate(start.getDate() - 7)
            end.setDate(end.getDate() - 7)
            break
        case DateRange.this_month:
        case DateRange.last_month:
            start.setMonth(start.getMonth() - 1)
            end.setMonth(end.getMonth() - 1)
            break
        case DateRange.last_2_months:
            start.setMonth(start.getMonth() - 2)
            end.setMonth(end.getMonth() - 2)
            break
        case DateRange.last_3_months:
            start.setMonth(start.getMonth() - 3)
            end.setMonth(end.getMonth() - 3)
            break
    }

    return { 
        start, 
        end 
    }
}

// return date in format 'YYYY-MM-DDTHH:MM:SS'
export function formatDate(value: Date) {
    const [date, time] = value.toLocaleString('en-US', { 
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).split(', ')

    const [month, day, year] = date.split('/')

    return `${year}-${month}-${day}T${time}`
}

export function rangeDates(date_range: DateRange) {
    const end = new Date()
    const start = new Date()

    switch (date_range) {
        case DateRange.last_24_hours:
            start.setHours(start.getHours() - 24)
            break
        case DateRange.last_7_days:
            start.setDate(start.getDate() - 7)
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

    return { start, end }
}