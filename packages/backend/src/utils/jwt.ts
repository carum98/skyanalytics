import jwt, { JwtPayload } from 'jsonwebtoken'
import config from 'config/jwt.config'

export function verifyToken (token: string): string | JwtPayload {
    return jwt.verify(token, config.token.secret)
}

export function verifyRefreshToken (token: string): string | JwtPayload {
    return jwt.verify(token, config.refreshToken.secret)
}

export function sign (payload: object | JwtPayload) {
    const token = jwt.sign(payload, config.token.secret, { 
        expiresIn: config.token.expiresIn
    })

    const refresh_token = jwt.sign(payload, config.refreshToken.secret, {
        expiresIn: config.refreshToken.expiresIn
    })

    return { 
        token, 
        refresh_token,
        expiredIn: config.token.expiresIn
    }
}