import { Database } from '@core/database.core'
import { Server } from '@core/server.core'
import { DepencyInjection } from '@core/di.core'

import { EventsRepository } from '@repositories/events.repositories'
import { EventsService } from '@services/events.service'

import { EventsRouter } from '@routes/events.routes'
import { SendRouter } from '@routes/send.routes'
import { errorMiddleware } from '@middlewares/error.middleware'
import { SourcesRouter } from '@routes/sources.routes'
import { SourcesRepository } from '@repositories/sources.repository'
import { SourcesService } from '@services/sources.service'
import { SessionService } from '@services/sessions.service'
import { SessionRepository } from '@repositories/sessions.repository'
import { NavigationRepository } from '@repositories/navigations.repository'
import { NavigationsService } from '@services/navigations.service'
import { NavigationsRouter } from '@routes/navigations.routes'
import { UserAccountsRouter } from '@routes/user_accounts.routes'
import { UserAccountsRepository } from '@repositories/user_accounts.repository'
import { UserAccountsService } from '@services/user_accounts.service'
import { BaseRouter } from '@routes/base.routes'
import { AuthService } from '@services/auth.service'
import { RefreshTokenRepository } from '@repositories/refresh_token.repository'
import { SessionsRouter } from '@routes/sessions.routes'
import { LocationsService } from '@services/locations.service'
import { LocationsRouter } from '@routes/locations.routes'
import { SummaryRepository } from '@repositories/summary.repository'
import { SummaryService } from '@services/summary.service'
import { SettingsRepository } from '@repositories/settings.repository'
import { SettingsRouter } from '@routes/settings.routes'

const di = DepencyInjection.getInstance()

// Register the Database
const database = di.register(() => new Database())

// Register Repositories
const db = database.db
const eventsRepository = di.register(() => new EventsRepository(db))
const sourcesRepository = di.register(() => new SourcesRepository(db))
const sessionRepository = di.register(() => new SessionRepository(db))
const navigationRepository = di.register(() => new NavigationRepository(db))
const userAccountsRepository = di.register(() => new UserAccountsRepository(db))
const refreshTokenRepository = di.register(() => new RefreshTokenRepository(db))
const summaryRepository = di.register(() => new SummaryRepository(db))
const settingsRepository = di.register(() => new SettingsRepository(db))

// Register Services
di.register(() => new EventsService(eventsRepository))
di.register(() => new SessionService(sessionRepository, sourcesRepository))
di.register(() => new NavigationsService(navigationRepository))
di.register(() => new SourcesService(sourcesRepository, sessionRepository, navigationRepository, eventsRepository))
di.register(() => new UserAccountsService(userAccountsRepository))
di.register(() => new AuthService(userAccountsRepository, refreshTokenRepository))
di.register(() => new LocationsService(sessionRepository))
di.register(() => new SummaryService(summaryRepository, settingsRepository))

const server = new Server()

server.routes([
    new BaseRouter(di),
    new EventsRouter(di),
    new SendRouter(di),
    new SourcesRouter(di),
    new NavigationsRouter(di),
    new UserAccountsRouter(di),
    new SessionsRouter(di),
    new LocationsRouter(di),
    new SettingsRouter(di)
])

server.middleware(errorMiddleware)

server.listen(3000)