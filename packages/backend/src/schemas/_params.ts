import { z } from 'zod'

export const paramsCode = z.object({
    code: z.string().length(6)
})

export type ParamsCode = z.infer<typeof paramsCode>