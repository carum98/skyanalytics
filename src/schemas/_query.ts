import { z } from 'zod'

// Metrics
export const metricsFilter = z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
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
}).merge(metricsFilter)

export type StatsFilter = z.infer<typeof statsFilter>