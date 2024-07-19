import { z } from 'zod'

export const metricsFilter = z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
})

export type MetricsFilter = z.infer<typeof metricsFilter>