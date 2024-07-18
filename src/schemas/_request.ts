import { z } from 'zod'

export const sendBodySchema = z.object({
    event: z.string().min(3).max(100).optional(),
    navigation: z.string().min(3).max(100).optional(),
})

export type SendBodySchema = z.infer<typeof sendBodySchema>