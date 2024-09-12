import { z } from 'zod'
import { createSelectSchema } from 'drizzle-zod'
import { userAccounts } from './user_accounts.schemas'

// Schemas
export const userSessionPayloadSchema = createSelectSchema(userAccounts)
	.pick({ code: true, name: true, role: true })

export const sessionPayload = z.object({
	payload: userSessionPayloadSchema
})

// Types
export type UserSessionPayloadSchema = z.infer<typeof userSessionPayloadSchema>
export type SessionPayload = z.infer<typeof sessionPayload>