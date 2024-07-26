import { RefreshTokenRepository } from '@repositories/refresh_token.repository'
import { UserAccountsRepository } from '@repositories/user_accounts.repository'
import { LoginBodySchema, RefreshTokenBodySchema } from '@schemas/_request'
import { NotFoundError, UnauthorizedError } from '@utils/errors'
import { matchPassword } from '@utils/hash-password'
import { sign } from '@utils/jwt'

export class AuthService {
    constructor(
        private userAccountsRepository: UserAccountsRepository,
        private refreshTokenRepository: RefreshTokenRepository
    ) {}

    public async login(params: LoginBodySchema) {
        const user = await this.userAccountsRepository.getPassword(params.email)

        if (!user) {
            throw new NotFoundError('User not found')
        }

        const { id, password, ...userAccount } = user

        const passwordMatch = matchPassword(params.password, password)

        if (!passwordMatch) {
            throw new UnauthorizedError('Invalid password')
        }

        const response = sign(userAccount)

        this.refreshTokenRepository.upsert({
            token: response.refresh_token,
            user_account_id: id
        })

        return response
    }

    public async refreshToken(params: RefreshTokenBodySchema) {
        const refreshToken = await this.refreshTokenRepository.get(params.refresh_token)

        if (!refreshToken) {
            throw new UnauthorizedError('Invalid refresh token')
        }

        if (!refreshToken.userAccount) {
            throw new UnauthorizedError('User not found')
        }

        const { userAccount: { id, ...payload } } = refreshToken

        const response = sign(payload)

        this.refreshTokenRepository.upsert({
            token: response.refresh_token,
            user_account_id: id
        })

        return response
    }
}