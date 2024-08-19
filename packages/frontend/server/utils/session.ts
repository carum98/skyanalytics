import { type SessionConfig, H3Event } from 'h3'
import * as h3 from 'h3'

export interface SessionData {
    token: string
    refreshToken: string
    expiredAt: number
}

const config = {
    name: 'skyanalytics',
    password: 'abe312002202557be2e39a6f20783198fd1225206ddce8170c31594c11f8d76a',
    maxAge: 32400,
    cookie: {
        httpOnly: false,
    }
} as SessionConfig

export async function getSkSession (event: H3Event): Promise<SessionData> {
    const session = await h3.getSession(event, config)

    return session.data as SessionData
}

export async function setSession (event: H3Event, data: SessionData) {
    await h3.updateSession(event, config, (_) => data)
}

export async function clearSkSession (event: H3Event) {
    await h3.clearSession(event, config)
    h3.deleteCookie(event, config.name as string)
}