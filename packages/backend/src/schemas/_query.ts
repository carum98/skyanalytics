import { DateRange } from '@utils/range-dates'
import { z } from 'zod'

// Metrics
export const metricsFilter = z.object({
    start: z.string().datetime({
        local: true
    }),
    end: z.string().datetime({
        local: true
    }),
    date_range: z.nativeEnum(DateRange)
})

export type MetricsFilter = z.infer<typeof metricsFilter>

// Stats
export const statsFilter = z.object({
    stats: z.preprocess(
        (value) => {
            if (typeof value === 'string') {
                return value.split(',')
            }

            return value
        },
        z.array(z.enum(['os', 'software', 'country', 'location', 'events', 'navigations']))
    )
})
.merge(metricsFilter)

export type StatsFilter = z.infer<typeof statsFilter>