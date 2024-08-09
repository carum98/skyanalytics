import { z } from 'zod'

export const headerXRealIPSchema = z.object({
    'x-real-ip': z.string().min(3).max(100),
})

export const headersSourceSchema = z.object({
    'x-skyanalytics-key': z.string({
        required_error: 'Header X-SkyAnalytics-Key is required'
    })
})

export const headersTimezoneSchema = z.object({
    'x-timezone': z.string().default('UTC+0'), // IANA Time Zone or Offset UTC ('America/Costa_Rica' or 'UTC-6')
})

export type HeadersTimeZone = z.infer<typeof headersTimezoneSchema>