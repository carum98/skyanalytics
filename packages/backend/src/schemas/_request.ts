import { z } from 'zod'

// Send Schema
export const sendBodySchema = z.object({
    event: z.string().min(3).max(100).optional(),
    navigation: z.string().min(3).max(100).optional(),
    metadata: z.record(z.string()).optional()
})
.refine((data) => !(data.event && data.navigation), {
    message: "You cannot send 'event' and 'navigation' at the same time",
    path: ['event', 'navigation'],
})
.refine((data) => data.event || data.navigation || data.metadata, {
    message: "'metadata' is required if you do not send 'event' or 'navigation'",
    path: ['metadata'],
})

export type SendBodySchema = z.infer<typeof sendBodySchema>

// Login Schema
export const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type LoginBodySchema = z.infer<typeof loginBodySchema>

// Refresh Token Schema
export const refreshTokenBodySchema = z.object({
    refresh_token: z.string(),
})

export type RefreshTokenBodySchema = z.infer<typeof refreshTokenBodySchema>