import { systemOperative } from '@utils/origin-detect'
import { DateRange } from '@utils/range-dates'
import { z } from 'zod'

// Metrics
export const metricsFilter = z.object({
    start: z.string().datetime({ local: true }),
    end: z.string().datetime({ local: true }),
    date_range: z.nativeEnum(DateRange)
})

export type MetricsFilter = z.infer<typeof metricsFilter>

// Stats
export const statsFilter = z.object({
    stats: z.preprocess(
        (value) => typeof value === 'string' ? value.split(',') : value,
        z.array(z.enum(['os', 'software', 'country', 'location', 'events', 'navigations']))
    )
})
.merge(metricsFilter)

export type StatsFilter = z.infer<typeof statsFilter>

// Filter sessions
export const filterSessions = z.object({
    so: z.enum(systemOperative).optional(),
    country: z.string().optional(),
    software: z.string().optional(),
    source_code: z.string().length(6).optional(),
})
.merge(metricsFilter)

export type FilterSessions = z.infer<typeof filterSessions>