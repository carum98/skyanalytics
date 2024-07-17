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

const di = DepencyInjection.getInstance()

// Register the Database
di.register(() => new Database())

// Register Repositories
di.register(() => new EventsRepository(di.resolve(Database).db))
di.register(() => new SourcesRepository(di.resolve(Database).db))
di.register(() => new SessionRepository(di.resolve(Database).db))

// Register Services
di.register(() => new EventsService(di.resolve(EventsRepository)))
di.register(() => new SourcesService(di.resolve(SourcesRepository)))
di.register(() => new SessionService(di.resolve(SessionRepository)))

const server = new Server()

server.routes([
    new EventsRouter(di),
    new SendRouter(di),
    new SourcesRouter(di)
])

server.middleware(errorMiddleware)

server.listen(3000)