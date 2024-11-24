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
import { ViewsRepository } from '@repositories/views.repository'
import { ViewsService } from '@services/views.service'
import { ViewsRouter } from '@routes/views.routes'
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
import { TasksScheduler } from '@core/tasks-scheduler.core'
import { SummaryTask } from '@tasks/summary.tasks'
import { TasksSchedulerRouter } from '@routes/task-scheduler.routes'
import { ReportsRepository } from '@repositories/reports.repository'
import { ReportsService } from '@services/reports.service'
import { ReportsRouter } from '@routes/reports.routes'

const di = DepencyInjection.getInstance()

// Register the Database
const database = di.register(() => new Database())

// Register Repositories
const db = database.db
const eventsRepository = di.register(() => new EventsRepository(db))
const sourcesRepository = di.register(() => new SourcesRepository(db))
const sessionRepository = di.register(() => new SessionRepository(db))
const navigationRepository = di.register(() => new ViewsRepository(db))
const userAccountsRepository = di.register(() => new UserAccountsRepository(db))
const refreshTokenRepository = di.register(() => new RefreshTokenRepository(db))
const summaryRepository = di.register(() => new SummaryRepository(db))
const settingsRepository = di.register(() => new SettingsRepository(db))
const reportsRepository = di.register(() => new ReportsRepository(db))

// Register Services
di.register(() => new EventsService(eventsRepository))
di.register(() => new SessionService(sessionRepository, sourcesRepository))
di.register(() => new ViewsService(navigationRepository))
di.register(() => new SourcesService(sourcesRepository, sessionRepository, navigationRepository, eventsRepository))
di.register(() => new UserAccountsService(userAccountsRepository))
di.register(() => new AuthService(userAccountsRepository, refreshTokenRepository))
di.register(() => new LocationsService(sessionRepository))
di.register(() => new SummaryService(summaryRepository, settingsRepository))
di.register(() => new ReportsService(reportsRepository))

// Tasks Scheduler
const tasksScheduler = di.register(() => new TasksScheduler())

tasksScheduler.tasks([
    new SummaryTask(di)
])

// API Server
const server = new Server()

server.routes([
    new BaseRouter(di),
    new EventsRouter(di),
    new SendRouter(di),
    new SourcesRouter(di),
    new ViewsRouter(di),
    new UserAccountsRouter(di),
    new SessionsRouter(di),
    new LocationsRouter(di),
    new SettingsRouter(di),
    new TasksSchedulerRouter(di),
    new ReportsRouter(di)
])

server.middleware(errorMiddleware)

// Start the server and tasks scheduler
server.listen(3000)
tasksScheduler.start()